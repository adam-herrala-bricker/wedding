import axios from 'axios'

const baseURL = '/api'

//might eventually want to put a user token back here for authenticating comments and "below image" stuff
//which should get handled through here

//POST request for loggin in
const login = async (credentials) => {
    const response = await axios.post(`${baseURL}/login`, credentials)
    return response.data

}

export default { login }