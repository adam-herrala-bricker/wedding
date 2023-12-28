const baseURL = 'https://herrala-bricker-wedding.onrender.com/api';

// generic function for get requests
const getGeneric = async (entryToken, path, referer) => {
  const response = await fetch(`${baseURL}/${path}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${entryToken}`,
      'Content-Type': 'application/json',
      'Referer': referer,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error);
  }

  return body;
};

// GET request for image metadata
export const getImages = async (entryToken, referer) => {
  return await getGeneric(entryToken, 'image-data', referer);
};

// GET request for audio metadata
export const getAudio = async (entryToken, referer) => {
  return await getGeneric(entryToken, 'audio-data', referer);
};

// GET request for scene metadata
export const getScenes = async (entryToken, referer) => {
  return await getGeneric(entryToken, 'scenes', referer);
};
