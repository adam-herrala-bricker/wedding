import {createSlice} from '@reduxjs/toolkit';
import {getScenes} from '../services/mediaServices';

// default state
const defaultAllScenes = null;
const defaultLoadedScene = null;

const sceneSlice = createSlice({
  name: 'scenes',

  initialState: {
    allScenes: defaultAllScenes,
    loadedScene: defaultLoadedScene,
  },

  reducers: {
    setLoadedScene(state, action) {
      return {...state, loadedScene: action.payload};
    },

    setAllScenes(state, action) {
      return {...state, allScenes: action.payload};
    },
  },
});

export const {setLoadedScene, setAllScenes} = sceneSlice.actions;

// packaged functions

export const initializeScenes = (entryToken, referer) => {
  return async (dispatch) => {
    if (entryToken) {
      const scenes = await getScenes(entryToken, referer);
      dispatch(setAllScenes(scenes));

      const sceneNames = scenes.map((i) => i.sceneName);

      // scene-0 is the 'all/kakki' scene under normal operation
      if (sceneNames.includes('scene-0')) {
        dispatch(setLoadedScene('scene-0'));
      }
    }
  };
};

export default sceneSlice.reducer;
