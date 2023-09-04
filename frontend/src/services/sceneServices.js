import axios from 'axios'
import {adminToken} from './adminServices'

const baseURL = '/api/scenes'

let entryToken = null

const setEntryToken = (newToken) => {
    entryToken = `Bearer ${newToken}`
}

//GET request for loading all the scenes (requires ENTRY token)
const getScenes = async () => {
    const config = {
        headers : {Authorization : entryToken}
    }

    const response = await axios.get(baseURL, config)

    return response.data

}

//POST request to add new scene (requires ADMIN token)
const addScene = async (newScene) => {
    const config = {
        headers : {Authorization : adminToken}
    }
    
    const response = await axios.post(baseURL, newScene, config)
    
    return response.data

}

//PUT request to update scenes (requires ADMIN token)
const updateScene = async (updatedScene) => {
    const config = {
        headers : {Authorization : adminToken}
    }

    const id = updatedScene.id

    const response = await axios.put(`${baseURL}/${id}`, updatedScene, config)

    return response.data

}

//DELETE request to remove a scene from the DB (requires ADMIN token)
const deleteScene = async (sceneToRemove) => {
    const config = {
        headers : {Authorization : adminToken}
    }

    const id = sceneToRemove.id
    const response = await axios.delete(`${baseURL}/${id}`, config)

    return response.data

}

export default {setEntryToken, getScenes, updateScene, addScene, deleteScene}