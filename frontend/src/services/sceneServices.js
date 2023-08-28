import axios from 'axios'

const baseURL = '/api/scenes'

let entryToken = null

const setEntryToken = (newToken) => {
    entryToken = `Bearer ${newToken}`
}

//GET request for loading all the scenes
const getScenes = async () => {
    const config = {
        headers : {Authorization : entryToken}
    }

    const response = await axios.get(baseURL, config)

    return response.data

}

//POST request to add new scene
const addScene = async (newScene) => {
    const config = {
        headers : {Authorization : entryToken}
    }
    
    const response = await axios.post(baseURL, newScene, config)
    
    return response.data

}

//PUT request to update scenes
const updateScene = async (updatedScene) => {
    const config = {
        headers : {Authorization : entryToken}
    }

    const id = updatedScene.id

    const response = await axios.put(`${baseURL}/${id}`, updatedScene, config)

    return response.data

}

export default {setEntryToken, getScenes, updateScene, addScene}