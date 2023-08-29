import axios from 'axios'

const baseURL = '/api/audio-data'

let entryToken = null

const setEntryToken = (newToken) => {
    entryToken = `Bearer ${newToken}`
}

//GET request for all audio data
const getAudioData = async () => {
    const config = {
        headers : {Authorization: entryToken}
    }

    const response = await axios.get(baseURL, config)
    
    return response.data
}


export default {setEntryToken, getAudioData}
