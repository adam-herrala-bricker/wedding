//reducer for handling list of scenes + currently loaded scene
import { createSlice } from '@reduxjs/toolkit'
import sceneServices from '../services/sceneServices'
import helpers from '../utilities/helpers'

const defaultLoaded = null
const defaultList = []

//helper to set object
const asObject = (loaded, list) => {
    return {loaded: loaded, list: list}
}

//main slice
const sceneSlice = createSlice({
    name: 'scenes',
    initialState: asObject(defaultLoaded, defaultList),
    reducers: {
        setLoaded(state, action) {
            return {...state, loaded: action.payload}
        },

        setList(state, action) {
            return {...state, list: action.payload}
        },

        addScene(state, action) {
            const currentList = state.list
            const newList = [...currentList, action.payload]
            return {...state, list: newList}
        },

        removeScene(state, action) {
            const sceneID = action.payload
            const newList = state.list.filter(i => i.id !== sceneID)

            return {...state, list: newList}
        },

        //changes a scene IN THE LIST, not the scene that's loaded
        changeScene(state, action) {
            const currentScenes = state.list
            const changedScene = action.payload

            const newScenes = [...currentScenes.filter(i => i.sceneName !== changedScene.sceneName), changedScene]

            newScenes.sort(helpers.compareScenes)

            return {...state, list: newScenes}

        }
    }
})

export const {setLoaded, setList, addScene, removeScene, changeScene} = sceneSlice.actions

//packaged functions

export const initializeScenes = (entryToken) => {
        return async dispatch => {
            //only try if user has an entry token (will still fail if token is invalid)
            if (entryToken) {
                const scenes = await sceneServices.getScenes()
                scenes.sort(helpers.compareScenes)
        
                dispatch(setList(scenes))
            }
        }
}

//updates the scene (ID provided) with a new list of image IDs
export const updateScene = (sceneID, imageIDs) => {
    return async dispatch => {
        const changedScene = await sceneServices.updateScene({ id: sceneID, imageIDs: imageIDs})
        
        dispatch(changeScene(changedScene))
    }
}

export const createNewScene = (sceneName) => {
    return async dispatch => {
        const addedScene = await sceneServices.addScene({sceneName})

        dispatch(addScene(addedScene))
    }
}

export const deleteScene = (scene) => {
    return async dispatch => {
        await sceneServices.deleteScene(scene)

        dispatch(removeScene(scene.id))
    }
}

export default sceneSlice.reducer