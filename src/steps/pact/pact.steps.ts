import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import { expect } from '@playwright/test';
import { Pact } from '@pact-foundation/pact';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

interface UserResponse {
  id: number;
  name: string;
  email?: string;
}

let provider: Pact | undefined;
let baseUrl: string;
let response: AxiosResponse;
let testInstanceId: string;

const getRandomPort = () => {
  const min = 9000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getUniqueInstanceId = () => {
  return crypto.randomBytes(8).toString('hex');
};

Before({ tags: '@pact' }, async function () {
  testInstanceId = getUniqueInstanceId();
  const reportsDir = path.resolve(process.cwd(), 'reports', 'pacts', String(process.pid), testInstanceId);
  ensureDir(reportsDir);

  provider = new Pact({
    consumer: 'PlaywrightConsumer',
    provider: 'UsersApiProvider',
    port: getRandomPort(),
    log: path.resolve(reportsDir, 'pact.log'),
    dir: reportsDir,
    logLevel: 'warn'
  });

  await provider.setup();
  baseUrl = provider.mockService.baseUrl;
  console.log(`[PACT] ${testInstanceId}: Pact provider setup at ${baseUrl}`);
});

After({ tags: '@pact' }, async function () {
  if (provider) {
    try {
      await provider.verify();
      console.log(`[PACT] ${testInstanceId}: Pact verification successful`);
    } catch (error) {
      console.error(`[PACT] ${testInstanceId}: Pact verification failed`, error);
      throw error;
    } finally {
      await provider.finalize();
      provider = undefined;
    }
  }
});

// Given steps
Given('a Pact mock provider is running', function () {
  expect(baseUrl).toBeDefined();
  console.log(`[PACT] ${testInstanceId}: Provider ready at ${baseUrl}`);
});

Given('the API will return a list of users', async function () {
  if (!provider) {
    throw new Error('Pact provider is not initialized');
  }

  await provider.addInteraction({
    state: 'users exist',
    uponReceiving: 'a request for users',
    withRequest: {
      method: 'GET',
      path: '/users'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com'
        }
      ]
    }
  });
});

Given('the API will return a user by ID', async function () {
  if (!provider) {
    throw new Error('Pact provider is not initialized');
  }

  await provider.addInteraction({
    state: 'user with ID 1 exists',
    uponReceiving: 'a request for a user by ID',
    withRequest: {
      method: 'GET',
      path: '/users/1'
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  });
});

Given('the API will create a user', async function () {
  if (!provider) {
    throw new Error('Pact provider is not initialized');
  }

  await provider.addInteraction({
    state: 'user can be created',
    uponReceiving: 'a request to create a user',
    withRequest: {
      method: 'POST',
      path: '/users',
      body: {
        name: 'New User',
        email: 'newuser@example.com'
      }
    },
    willRespondWith: {
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        id: 3,
        name: 'New User',
        email: 'newuser@example.com'
      }
    }
  });
});

Given('the API will update a user', async function () {
  if (!provider) {
    throw new Error('Pact provider is not initialized');
  }

  await provider.addInteraction({
    state: 'user with ID 1 exists',
    uponReceiving: 'a request to update a user',
    withRequest: {
      method: 'PUT',
      path: '/users/1',
      body: {
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com'
      }
    }
  });
});

Given('the API will delete a user', async function () {
  if (!provider) {
    throw new Error('Pact provider is not initialized');
  }

  await provider.addInteraction({
    state: 'user with ID 1 exists',
    uponReceiving: 'a request to delete a user',
    withRequest: {
      method: 'DELETE',
      path: '/users/1'
    },
    willRespondWith: {
      status: 204
    }
  });
});

// When steps
When('I request users from the mock API', async function () {
  response = await axios.get(`${baseUrl}/users`);
});

When('I request user with ID 1 from the mock API', async function () {
  response = await axios.get(`${baseUrl}/users/1`);
});

When('I create a user via the mock API', async function () {
  response = await axios.post(`${baseUrl}/users`, {
    name: 'New User',
    email: 'newuser@example.com'
  });
});

When('I update a user via the mock API', async function () {
  response = await axios.put(`${baseUrl}/users/1`, {
    name: 'Updated Name',
    email: 'updated@example.com'
  });
});

When('I delete a user via the mock API', async function () {
  response = await axios.delete(`${baseUrl}/users/1`);
});

// Then steps
Then('the Pact response should match', function () {
  expect(response).toBeDefined();
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
});

Then('the response contains valid user objects', function () {
  expect(Array.isArray(response.data)).toBeTruthy();
  expect(response.data.length).toBeGreaterThan(0);
  response.data.forEach((user: UserResponse) => {
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(typeof user.id).toBe('number');
    expect(typeof user.name).toBe('string');
  });
});

Then('the response user has ID 1', function () {
  expect(response.data.id).toBe(1);
});

Then('the Pact create response should match', function () {
  expect(response.status).toBe(201);
  expect(response.data.id).toBeDefined();
  expect(response.data.name).toBe('New User');
  expect(response.data.email).toBe('newuser@example.com');
});

Then('the response contains the created user data', function () {
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('name');
  expect(response.data).toHaveProperty('email');
  expect(typeof response.data.id).toBe('number');
});

Then('the Pact update response should match', function () {
  expect(response.status).toBe(200);
  expect(response.data.id).toBe(1);
  expect(response.data.name).toBe('Updated Name');
  expect(response.data.email).toBe('updated@example.com');
});

Then('the response contains the updated user data', function () {
  expect(response.data).toHaveProperty('id');
  expect(response.data).toHaveProperty('name');
  expect(response.data.name).toBe('Updated Name');
});

Then('the Pact delete response should match', function () {
  expect(response.status).toBe(204);
});
