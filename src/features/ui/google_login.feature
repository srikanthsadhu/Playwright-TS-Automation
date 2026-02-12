@ui @login
Feature: Google Login Page
  As a user
  I want to test Google login functionality
  So that I can verify authentication flows

  Background:
    Given I navigate to Google login page

  Scenario: Verify email input field is visible
    Then I should see the email input field

  Scenario: Enter email address
    When I enter email "test@example.com"
    And I click the Next button
    Then I should proceed to password page

  Scenario: Validate error message for invalid email
    When I enter email "invalid-email"
    And I click the Next button
    Then I should see an error message
