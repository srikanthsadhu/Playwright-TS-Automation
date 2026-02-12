#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   OWNER=<github-owner> REPO=<github-repo> SUBSCRIPTION_ID=<sub> \
#   IDENTITY_RG=rg-pipeline-identity IDENTITY_NAME=gh-actions-uami \
#   LOCATION=eastus DEV_RG=rg-dev STAGING_RG=rg-staging PROD_RG=rg-prod \
#   ./setup-azure-auth-for-pipeline.sh

OWNER=${OWNER:?"OWNER is required"}
REPO=${REPO:?"REPO is required"}
SUBSCRIPTION_ID=${SUBSCRIPTION_ID:?"SUBSCRIPTION_ID is required"}

IDENTITY_RG=${IDENTITY_RG:-"rg-pipeline-identity"}
IDENTITY_NAME=${IDENTITY_NAME:-"gh-actions-uami"}
LOCATION=${LOCATION:-"eastus"}

DEV_RG=${DEV_RG:?"DEV_RG is required"}
STAGING_RG=${STAGING_RG:?"STAGING_RG is required"}
PROD_RG=${PROD_RG:?"PROD_RG is required"}

az account set --subscription "$SUBSCRIPTION_ID"

# Create identity resource group
az group create --name "$IDENTITY_RG" --location "$LOCATION"

# Create user-assigned managed identity
az identity create --name "$IDENTITY_NAME" --resource-group "$IDENTITY_RG" --location "$LOCATION"

CLIENT_ID=$(az identity show -g "$IDENTITY_RG" -n "$IDENTITY_NAME" --query clientId -o tsv)
PRINCIPAL_ID=$(az identity show -g "$IDENTITY_RG" -n "$IDENTITY_NAME" --query principalId -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

echo "CLIENT_ID=$CLIENT_ID"
echo "PRINCIPAL_ID=$PRINCIPAL_ID"
echo "TENANT_ID=$TENANT_ID"

# Role assignments per environment
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$DEV_RG"
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$STAGING_RG"
az role assignment create --assignee-object-id "$PRINCIPAL_ID" --assignee-principal-type ServicePrincipal --role "Contributor" --resource-group "$PROD_RG"

# Federated credentials for GitHub environments
az identity federated-credential create \
  --name "gh-actions-dev" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:dev" \
  --audience "api://AzureADTokenExchange"

az identity federated-credential create \
  --name "gh-actions-staging" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:staging" \
  --audience "api://AzureADTokenExchange"

az identity federated-credential create \
  --name "gh-actions-production" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$IDENTITY_RG" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:${OWNER}/${REPO}:environment:production" \
  --audience "api://AzureADTokenExchange"

cat <<EOF

Next steps:
1) Add GitHub environments: dev, staging, production
2) Add secrets per environment:
   - AZURE_CLIENT_ID=$CLIENT_ID
   - AZURE_TENANT_ID=$TENANT_ID
   - AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID
3) Add variables per environment:
   - AZURE_RESOURCE_GROUP
   - AZURE_HOSTING_TYPE (appservice|containerapps|aks)
   - AZURE_APP_NAME (App Service only)
   - DEPLOY_PACKAGE_PATH (App Service only)
   - AZURE_CONTAINERAPP_NAME (Container Apps only)
   - AZURE_IMAGE_NAME (Container Apps/AKS)
   - AZURE_AKS_CLUSTER_NAME (AKS only)
   - AZURE_AKS_NAMESPACE (AKS only)
EOF
