import axios from 'axios'

const baseURL = '/api'

//note: these get imported to other services to use with authentication
let token = null

//helper functions for correct token format for requests
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

//POST request for loggin in
const login = async (credentials) => {
    const response = await axios.post(`${baseURL}/login`, credentials)
    return response.data

}

export default { setToken, login }