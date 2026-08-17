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
  const response = http.post(
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

  check(response, {
    'login status is 200': (r) => r.status === 200,
    'login returns access token': (r) => r.json('accessToken') !== undefined,
  });

  if (response.status !== 200) {
    throw new Error(`Login failed: ${response.status} ${response.body}`);
  }

  return {
    accessToken: response.json('accessToken'),
  };
}

export default function (data) {
  const response = http.get(`${BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
    },
  });

  check(response, {
    'products status is 200': (r) => r.status === 200,
    'products response is not empty': (r) => r.body.length > 0,
  });

  sleep(1);
}
