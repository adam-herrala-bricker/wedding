import axios from 'axios';

const baseURL = '/api';

// POST request for loggin in
const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login`, credentials);

  return response.data;
};

// POST request for confirming entry token is correct
// (this is used to keep demo users from viewing a partially rendered main page)
const entryCheck = async (token) => {
  const config = {headers: {Authorization: `Bearer ${token}`}};

  const response = await axios.post(`${baseURL}/entry-check`, {}, config);

  return response.data;
};

export default {login, entryCheck};
