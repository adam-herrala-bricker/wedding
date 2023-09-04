import axios from 'axios'
import {adminToken} from './adminServices'

const baseURL = '/api/image-data'

let entryToken = null

const setEntryToken = (newToken) => {
    entryToken = `Bearer ${newToken}`
}

//GET request for all image (meta)data (requires ENTRY token)
//authenticated using token given upon entering the site --> prevents accessing images just by manually setting local storage
const getImageData = async () => {
    const config = {
        headers : {Authorization: entryToken}
    }

    const response = await axios.get(baseURL, config)
    
    return response.data
}

//PUT request to update image (meta)data (requires ADMIN token)
const updateImageData = async (newData) => {
    const config = {
        headers : {Authorization: adminToken}
    }

    const thisID = newData.id

    const response = await axios.put(`${baseURL}/${thisID}`, newData, config)

    return response.data

}

export default {getImageData, updateImageData, setEntryToken}