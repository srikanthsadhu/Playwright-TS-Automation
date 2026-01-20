@ui
Feature: Google Home Page
  As a user
  I want to interact with Google home page
  So that I can search for information

  Background:
    Given I navigate to Google home page

  Scenario: Verify Google logo is displayed
    Then I should see the Google logo

  Scenario: Verify page title
    Then the page title should be "Google"

  Scenario: Search for a term
    When I search for "Playwright TypeScript"
    Then I should see search results
