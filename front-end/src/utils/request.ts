import { UserContext } from '../contexts';
import { apiUrl } from '../api';

export const request = async (
  url = '',
  body: NonNullable<unknown> | null,
  options: RequestInit = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  },
  userContext?: React.ContextType<typeof UserContext>
) => {
  const params: RequestInit = {
    method: options.method,
    mode: options.mode,
    cache: options.cache,
    credentials: options.credentials,
    headers: options.headers,
    redirect: options.redirect,
    referrerPolicy: options.referrerPolicy
  };

  if (body && options.method !== 'GET') {
    params.body = JSON.stringify(body);
  }

  const response = await fetch(url, params);

  if (!response.ok) {
    if (response.status === 401 && userContext) {
      const newAccessToken = await refreshAccessToken(userContext);

      return await fetch(url, {
        ...params,
        headers: {
          ...params?.headers,
          Authorization: `Bearer ${newAccessToken}`
        }
      });
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

async function refreshAccessToken(userContext: React.ContextType<typeof UserContext>) {
  request(`${apiUrl}/auth/refresh-token`, {
    refreshToken: userContext?.user?.refreshToken
  }).then((newAccessToken: string) => userContext.replaceAccessToken(newAccessToken));
}
