@pact @api @contract
Feature: Pact contract for Users API
  As a consumer
  I want to validate the contract with the Users API provider
  So that both parties agree on the API response

  @pact-get @parallel
  Scenario: Get users returns a list of users
    Given a Pact mock provider is running
    And the API will return a list of users
    When I request users from the mock API
    Then the Pact response should match
    And the response contains valid user objects

  @pact-create @parallel
  Scenario: Create user returns created user
    Given a Pact mock provider is running
    And the API will create a user
    When I create a user via the mock API
    Then the Pact create response should match
    And the response contains the created user data

  @pact-update @parallel
  Scenario: Update user returns updated user
    Given a Pact mock provider is running
    And the API will update a user
    When I update a user via the mock API
    Then the Pact update response should match
    And the response contains the updated user data

  @pact-delete @parallel
  Scenario: Delete user returns no content
    Given a Pact mock provider is running
    And the API will delete a user
    When I delete a user via the mock API
    Then the Pact delete response should match

  @pact-validation
  Scenario: Get user by ID returns specific user
    Given a Pact mock provider is running
    And the API will return a user by ID
    When I request user with ID 1 from the mock API
    Then the Pact response should match
    And the response user has ID 1
