// reducer for handling list of scenes + currently loaded scene
import {createSlice} from '@reduxjs/toolkit';
import sceneServices from '../services/sceneServices';
import helpers from '../utilities/helpers';

const defaultLoaded = null; // the scene to display to users
const defaultList = []; // a list of all available scenes

// helper to set object
const asObject = (loaded, list) => {
  return {loaded: loaded, list: list};
};

// main slice
const sceneSlice = createSlice({
  name: 'scenes',

  initialState: asObject(defaultLoaded, defaultList),

  reducers: {
    setLoaded(state, action) {
      return {...state, loaded: action.payload};
    },

    // return to default loaded scene
    resetLoaded(state) {
      return {...state, loaded: defaultLoaded};
    },

    setList(state, action) {
      return {...state, list: action.payload};
    },

    addScene(state, action) {
      const currentList = state.list;
      const newList = [...currentList, action.payload];
      return {...state, list: newList};
    },

    removeScene(state, action) {
      const sceneID = action.payload;
      const newList = state.list.filter((i) => i.id !== sceneID);

      return {...state, list: newList};
    },
  },
});

export const {
  setLoaded,
  resetLoaded,
  setList,
  addScene,
  removeScene,
} = sceneSlice.actions;

// packaged functions

export const initializeScenes = (entryToken) => {
  return async (dispatch) => {
  // only try if user has an entry token (will still fail if token is invalid)
    if (entryToken) {
      const scenes = await sceneServices.getScenes();
      scenes.sort(helpers.compareScenes);

      dispatch(setList(scenes));
    }
  };
};

export const createNewScene = (sceneName) => {
  return async (dispatch) => {
    const addedScene = await sceneServices.addScene({sceneName});

    dispatch(addScene(addedScene));
  };
};

export const deleteScene = (scene) => {
  return async (dispatch) => {
    await sceneServices.deleteScene(scene);

    dispatch(removeScene(scene.id));
  };
};

export default sceneSlice.reducer;
