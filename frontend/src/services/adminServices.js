import axios from 'axios'

const baseURL = '/api/admin/upload'

let adminToken = null

const setAdminToken = (newToken) => {
    adminToken = `Bearer ${newToken}`
}

//POST request for uploading images
const postImage = async (imageFile) => {
    //set cofig for authorization
    const config = {
        headers: { Authorization: adminToken },
      }
    
    console.log(config)
    
    //need to do files as form data
    const formData = new FormData()

    formData.append('testName', imageFile)

    const response = await axios.post(`${baseURL}/images`, formData, config)
    console.log(response)

    return response.data
}

//DELETE request for deleting a single image
const deleteImage = async (imageID) => {
    //will add authentication later

    const response = await axios.delete(`/api/image-data/${imageID}`)
    return response.data
}

export default {postImage, deleteImage, setAdminToken}