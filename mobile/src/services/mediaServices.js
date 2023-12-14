const baseURL = 'https://herrala-bricker-wedding.onrender.com/api';

// GET request for image metadata
export const getImages = async (entryToken) => {
  const response = await fetch(`${baseURL}/image-data`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${entryToken}`,
      'Content-Type': 'application/json',
    },
  });

  const body = response.json();

  if (!response.ok) {
    throw new Error(body.error);
  }

  return body;
};
