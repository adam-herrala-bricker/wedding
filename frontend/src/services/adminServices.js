import axios from 'axios'

const baseURL = '/api/admin/upload'

//POST request for image
const postImage = async (imageFile) => {
    //need to do files as form data
    const formData = new FormData()

    formData.append('testName', imageFile)

    const response = await axios.post(`${baseURL}/images`, formData)
    console.log(response)

    return response.data
}

export default {postImage}