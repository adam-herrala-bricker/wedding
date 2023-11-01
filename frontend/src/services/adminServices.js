import axios from 'axios'
import { getAdminToken } from './tokenHelpers'

const baseURL = '/api/admin/upload'

//POST request for uploading images
const postImage = async (imageFile) => {
    const adminToken = getAdminToken()

    //set cofig for authorization
    const config = {
        headers: { Authorization: adminToken },
      }
    
    //need to do files as form data
    const formData = new FormData()

    formData.append('adminUpload', imageFile)

    const response = await axios.post(`${baseURL}/images`, formData, config)

    return response.data
}

//POST request for uploading audio files
const postAudio = async (audioFile) => {
    const adminToken = getAdminToken()

    const config = {
        headers: {Authorization: adminToken}
    }

    const formData = new FormData()
    formData.append('adminUpload', audioFile)

    const response = await axios.post(`${baseURL}/audio`, formData, config)
    return response.data

}

//DELETE request for deleting a single image
const deleteImage = async (imageID) => {
    const adminToken = getAdminToken()

    const config = {
        headers: {Authorization : adminToken}
    }

    const response = await axios.delete(`/api/image-data/${imageID}`, config)
    return response.data
}

//DELETE request for deleting a single audio file
const deleteAudio = async (audioID) => {
    const adminToken = getAdminToken()

    const config = {
        headers: {Authorization : adminToken}
    }

    const response = await axios.delete(`/api/audio-data/${audioID}`, config)
    return response.data
}

export default {postImage, postAudio, deleteImage, deleteAudio }