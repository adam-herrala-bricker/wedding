import axios from 'axios';

const baseURL = '/api';

// POST request for loggin in
const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login`, credentials);

  return response.data;
};

export default {login};
