import { Given, When, Then, Before } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import { expect } from '@playwright/test';
import { PropertyReader } from '../../utils/propertyReader';

let response: AxiosResponse;
let propertyReader: PropertyReader;
let apiBaseUrl: string;

Before({ tags: '@api' }, function () {
  propertyReader = new PropertyReader(process.env.ENV || 'dev');
  apiBaseUrl = propertyReader.getApiBaseUrl();
});

When('I send a GET request to {string}', async function (endpoint: string) {
  console.log('******API BASE URL:', `${apiBaseUrl}${endpoint}`);
  response = await axios.get(`${apiBaseUrl}${endpoint}`);
});

When('I send a POST request to {string} with body:', async function (endpoint: string, body: string) {
  const parsedBody = JSON.parse(body);
  response = await axios.post(`${apiBaseUrl}${endpoint}`, parsedBody);
});

When('I send a PUT request to {string} with body:', async function (endpoint: string, body: string) {
  const parsedBody = JSON.parse(body);
  response = await axios.put(`${apiBaseUrl}${endpoint}`, parsedBody);
});

When('I send a DELETE request to {string}', async function (endpoint: string) {
  response = await axios.delete(`${apiBaseUrl}${endpoint}`);
});

Then('the response status code should be {int}', function (statusCode: number) {
  expect(response.status).toBe(statusCode);
});

Then('the response should contain a list of users', function () {
  // console.log('RESPONSE of GET:'+ JSON.stringify(response.data));
  expect(Array.isArray(response.data)).toBeTruthy();
  expect(response.data.length).toBeGreaterThan(0);
  console.log('RESPONSE of GET First Name ********:'+ JSON.stringify(response.data[0].name));
});

Then('the response should contain user details', function () {
  expect(response.data).toBeDefined();
  expect(response.data.id).toBeDefined();
  expect(response.data.name).toBeDefined();


});

Then('the response should contain the created user', function () {
  expect(response.data).toBeDefined();
  expect(response.data.id).toBeDefined();
});
