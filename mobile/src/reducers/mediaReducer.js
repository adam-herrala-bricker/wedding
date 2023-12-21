// handles states for serving media
// (all images loaded from server, images for a current scene,
// the image for highlight view, plus swipe handling between images)
import {createSlice} from '@reduxjs/toolkit';
import {getImages} from '../services/mediaServices';
import {getAdjoining, swipeHelper} from '../utils/helpers';

// default state
const defaultAllImages = []; // every image on server
const defaultViewImages = []; // the images to view now
const defaultAudio = [];
const defaultSwipe = {x: 0, y: 0};
const defaultHighlight = '';

const mediaSlice = createSlice({
  name: 'media',

  initialState: {
    allImages: defaultAllImages,
    viewImages: defaultViewImages,
    audio: defaultAudio,
    swipeStart: defaultSwipe,
    swipeEnd: defaultSwipe,
    highlight: defaultHighlight,
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

    setHighlight(state, action) {
      return {...state, highlight: action.payload};
    },

    setSwipeStart(state, action) {
      return {...state, swipeStart: action.payload};
    },

    // this also handles changing the view based on the swipe start and end
    setSwipeEnd(state, action) {
      const highlight = state.highlight;
      const viewImages = state.viewImages;
      const swipeStart = state.swipeStart;
      const swipeEnd = action.payload;
      const swipeDirection = swipeHelper(swipeStart, swipeEnd);
      if (swipeDirection) {
        const newImage = getAdjoining(highlight, viewImages, swipeDirection);
        // sets swipe back to default + changes highlight
        return {
          ...state,
          highlight: newImage,
          swipeStart: defaultSwipe,
          swipeEnd: defaultSwipe,
        };
      }

      // default = do nothing
      return {...state};
    },

  },
});

export const {
  setAllImages,
  setViewImages,
  filterImages,
  setHighlight,
  setSwipeStart,
  setSwipeEnd,
} = mediaSlice.actions;

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

export default mediaSlice.reducer;
