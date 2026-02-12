# GitHub Actions Pipeline Setup (Deploy-Only)

This project uses **GitHub Actions** with **OIDC** and a **User-assigned Managed Identity** (UAMI). The pipeline supports **dev**, **staging**, and **production** environments.

## 1) Create a User-assigned Managed Identity (UAMI)

Create the identity in a **separate resource group** dedicated to pipeline auth.

```bash
# Variables
SUBSCRIPTION_ID="<subscription-id>"
IDENTITY_RG="rg-pipeline-identity"
IDENTITY_NAME="gh-actions-uami"
LOCATION="eastus"

az account set --subscription "$SUBSCRIPTION_ID"

# Create identity RG
az group create --name "$IDENTITY_RG" --location "$LOCATION"

# Create user-assigned managed identity
az identity create --name "$IDENTITY_NAME" --resource-group "$IDENTITY_RG" --location "$LOCATION"
```

Capture identity details:
```bash
CLIENT_ID=$(az identity show -g "$IDENTITY_RG" -n "$IDENTITY_NAME" --query clientId -o tsv)
PRINCIPAL_ID=$(az identity show -g "$IDENTITY_RG" -n "$IDENTITY_NAME" --query principalId -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

echo "CLIENT_ID=$CLIENT_ID"
echo "PRINCIPAL_ID=$PRINCIPAL_ID"
echo "TENANT_ID=$TENANT_ID"
```

## 2) Assign RBAC permissions

Grant the identity access to each environment resource group (deploy-only):

```bash
# Example RGs (replace with your own)
DEV_RG="rg-dev"
STAGING_RG="rg-staging"
PROD_RG="rg-prod"

az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$DEV_RG"
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$STAGING_RG"
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$PROD_RG"
```

If you deploy containers from ACR, also grant **AcrPull**:
```bash
ACR_ID=$(az acr show -n "<acr-name>" -g "<acr-rg>" --query id -o tsv)
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "AcrPull" --scope "$ACR_ID"
```

## 3) Add Federated Credentials (per environment)

Create a federated credential for each GitHub environment:

```bash
OWNER="<github-owner>"
REPO="<github-repo>"

# dev
az identity federated-credential create \
  --name "gh-actions-dev" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:dev" \
  --audience "api://AzureADTokenExchange"

# staging
az identity federated-credential create \
  --name "gh-actions-staging" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:staging" \
  --audience "api://AzureADTokenExchange"

# production
az identity federated-credential create \
  --name "gh-actions-production" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:production" \
  --audience "api://AzureADTokenExchange"
```

## 4) Configure GitHub Environments

Create GitHub environments:
- **dev**
- **staging**
- **production**

Add required approvals for **staging** and **production**.

### Environment secrets (per environment)

Set these as **secrets** in each environment:
- `AZURE_CLIENT_ID` (from UAMI)
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

### Environment variables (per environment)

Set these as **variables** in each environment:

**Required for all hosting types**
- `AZURE_RESOURCE_GROUP`
- `AZURE_HOSTING_TYPE` (appservice | containerapps | aks)

**App Service**
- `AZURE_APP_NAME`
- `DEPLOY_PACKAGE_PATH` (zip or folder path)

**Container Apps**
- `AZURE_CONTAINERAPP_NAME`
- `AZURE_IMAGE_NAME` (e.g., myacr.azurecr.io/app:tag)

**AKS**
- `AZURE_AKS_CLUSTER_NAME`
- `AZURE_AKS_NAMESPACE`
- `AZURE_IMAGE_NAME` (e.g., myacr.azurecr.io/app:tag)

## 5) CI/CD Behavior

- **CI** runs on `pull_request` and `push` to `main`.
- **CD** runs only on `push` to `main` and `workflow_dispatch` (never on PRs).
- **Deploy-only**: No infra provisioning is performed.

## 6) Validate

Trigger the workflow manually or push to `main`. Ensure the required environment variables and secrets are set for each environment.
