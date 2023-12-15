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
  },
});

export const {setAllImages} = mediaSlice.actions;

// packaged functions
export const initializeImages = (entryToken) => {
  return async (dispatch) => {
    // only tries to initialize if there's an entry token
    if (entryToken) {
      const images = await getImages(entryToken);
      dispatch(setAllImages(images));
    }
  };
};

export default mediaSlice.reducer;
