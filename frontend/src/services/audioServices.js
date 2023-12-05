import axios from 'axios';
import {getEntryToken} from './tokenHelpers';

const baseURL = '/api/audio-data';

// GET request for all audio metadata (requires ENTRY token)
const getAudioData = async () => {
  const entryToken = getEntryToken();
  const config = {headers: {Authorization: entryToken}};

  const response = await axios.get(baseURL, config);

  return response.data;
};

export default {getAudioData};
