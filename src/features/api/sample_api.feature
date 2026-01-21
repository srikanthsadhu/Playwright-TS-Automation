@api
Feature: Sample API Tests
  As a developer
  I want to test REST APIs
  So that I can verify API functionality
 
  @apiGet
  Scenario: Get list of users
    When I send a GET request to "/users"
    Then the response status code should be 200
    And the response should contain a list of users

  Scenario: Get a single user by ID
    When I send a GET request to "/users/1"
    Then the response status code should be 200
    And the response should contain user details

  Scenario: Create a new user
    When I send a POST request to "/users" with body:
      """
      {
        "name": "Test User",
        "email": "test@example.com"
      }
      """
    Then the response status code should be 201
    And the response should contain the created user

  Scenario: Update an existing user
    When I send a PUT request to "/users/1" with body:
      """
      {
        "name": "Updated User",
        "email": "updated@example.com"
      }
      """
    Then the response status code should be 200

  Scenario: Delete a user
    When I send a DELETE request to "/users/1"
    Then the response status code should be 200
