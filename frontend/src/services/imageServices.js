import axios from 'axios'

const baseURL = '/api/image-data'

let entryToken = null

const setEntryToken = (newToken) => {
    entryToken = `Bearer ${newToken}`
}

//GET request for all image (meta)data
//authenticated using token given upon entering the site --> prevents accessing images just by manually setting local storage
const getImageData = async () => {
    const config = {
        headers : {Authorization: entryToken}
    }

    const response = await axios.get(baseURL, config)
    
    return response.data
}

export default {getImageData, setEntryToken}