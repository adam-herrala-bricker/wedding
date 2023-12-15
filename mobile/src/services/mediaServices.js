const baseURL = 'https://herrala-bricker-wedding.onrender.com/api';

// generic function for get requests
const getGeneric = async (entryToken, path) => {
  const response = await fetch(`${baseURL}/${path}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${entryToken}`,
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error);
  }

  return body;
};

// GET request for image metadata
export const getImages = async (entryToken) => {
  return await getGeneric(entryToken, 'image-data');
};

// GET request for scene metadata
export const getScenes = async (entryToken) => {
  return await getGeneric(entryToken, 'scenes');
};
