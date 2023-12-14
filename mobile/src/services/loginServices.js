const baseURL = 'https://herrala-bricker-wedding.onrender.com/api';

// GET request to login (also used for checking entry key)
export const login = async (username, password) => {
  const response = await fetch(`${baseURL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  });

  const body = await response.json();

  return body;
};
