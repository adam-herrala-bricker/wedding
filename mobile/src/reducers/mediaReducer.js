import {createSlice} from '@reduxjs/toolkit';

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

export default mediaSlice.reducer;
