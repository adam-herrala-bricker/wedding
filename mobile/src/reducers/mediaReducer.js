import {createSlice} from '@reduxjs/toolkit';
import {getImages} from '../services/mediaServices';

// default state
const defaultAllImages = []; // every image on server
const defaultViewImages = []; // the images to view now
const defaultAudio = [];

const mediaSlice = createSlice({
  name: 'media',

  initialState: {
    allImages: defaultAllImages,
    viewImages: defaultViewImages,
    audio: defaultAudio,
  },

  reducers: {
    setAllImages(state, action) {
      return {...state, allImages: action.payload};
    },

    // only used on initialization
    setViewImages(state, action) {
      return {...state, viewImages: action.payload};
    },

    // used for subsequent filtering of VIEW IMAGES ONLY
    filterImages(state, action) {
      const newScene = action.payload;
      const allImages = state.allImages;

      // default scene
      if (newScene === 'scene.0') {
        return {...state, viewImages: allImages};
      }

      // anything other than a default scene
      const filteredImages = allImages
          .filter((i) => i.scenes.map((j) => j.sceneName).includes(newScene));

      return {...state, viewImages: filteredImages};
    },
  },
});

export const {setAllImages, setViewImages, filterImages} = mediaSlice.actions;

// packaged functions

// get all image metadata (after entry)
export const initializeImages = (entryToken) => {
  return async (dispatch) => {
    // only tries to initialize if there's an entry token
    if (entryToken) {
      const images = await getImages(entryToken);
      dispatch(setAllImages(images));
      dispatch(setViewImages(images));
    }
  };
};

// change the displayed images

export default mediaSlice.reducer;
