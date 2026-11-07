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

export default function () {
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
    'access token is returned': (r) => r.json('accessToken') !== undefined,
    'refresh token is returned': (r) => r.json('refreshToken') !== undefined,
  });

  sleep(1);
}
