//handles lists of all media files (images + music)
//note that this is just the metadata, not the actual files themselves
import { createSlice } from "@reduxjs/toolkit"
import audioServices from '../services/audioServices'
import adminServices from '../services/adminServices'
import helpers from '../utilities/helpers'

const defaultImagesAll = []
const defaultImagesDisplay = []
const defaultMusic = []

//note the structure!
const asObject = (imagesAll, imagesDisplay, music) => {
    return {images : {all: imagesAll, display: imagesDisplay}, music: music}
}

const mediaSlice = createSlice({
    name: 'media',
    initialState: asObject(defaultImagesAll, defaultImagesDisplay, defaultMusic),
    reducers: {
        setMusic(state, action) {
            return {...state, music: action.payload}
        },

        removeSong(state, action) {
            const songID= action.payload
            const newSongs = state.music.filter(i => i.id !== songID)

            return {...state, music: newSongs}
        }
    }
})

export const { setMusic, removeSong } = mediaSlice.actions

//packaged functions
export const initializeMusic = () => {
    return async dispatch => {
        const audioData = await audioServices.getAudioData()
        audioData.sort(helpers.compareSongs)

        dispatch(setMusic(audioData))
    }
}

export const deleteSong = (songID) => {
    return async dispatch => {
        await adminServices.deleteAudio(songID)

        dispatch(removeSong(songID))
    }
}

export default mediaSlice.reducer