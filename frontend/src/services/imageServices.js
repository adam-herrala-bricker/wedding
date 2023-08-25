import axios from 'axios'

const baseURL = '/api/image-data'

//GET request for all image (meta)data
const getImageData = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

export default {getImageData}