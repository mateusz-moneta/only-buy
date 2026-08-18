import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5000/api';

const USERNAME = __ENV.TEST_USERNAME;
const PASSWORD = __ENV.TEST_PASSWORD;

export const options = {
  vus: 1000,
  duration: '30s',

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export function setup() {
  const loginResponse = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login returns access token': (r) => r.json('accessToken') !== undefined,
  });

  if (loginResponse.status !== 200) {
    throw new Error(
      `Login failed: ${loginResponse.status} ${loginResponse.body}`,
    );
  }

  const accessToken = loginResponse.json('accessToken');

  const productsResponse = http.get(`${BASE_URL}/products?page=1&limit=20`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  check(productsResponse, {
    'products status is 200': (r) => r.status === 200,
    'products response has data': (r) => Array.isArray(r.json('data')),
    'products list is not empty': (r) => r.json('data')?.length > 0,
  });

  if (productsResponse.status !== 200) {
    throw new Error(
      `Products request failed: ${productsResponse.status} ${productsResponse.body}`,
    );
  }

  const products = productsResponse.json('data');

  if (!products || products.length === 0) {
    throw new Error('No products available for performance test');
  }

  return {
    accessToken,
    productId: products[0].id,
  };
}

export default function (data) {
  const response = http.get(`${BASE_URL}/products/${data.productId}`, {
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });

  check(response, {
    'product status is 200': (r) => r.status === 200,
    'product has id': (r) => r.json('id') !== undefined,
  });

  sleep(1);
}
