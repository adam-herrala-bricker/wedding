// handles states for serving media
// (all images loaded from server, images for a current scene,
// the image for highlight view, plus swipe handling between images)
import TrackPlayer from 'react-native-track-player';
import {createSlice} from '@reduxjs/toolkit';
import {getAudio, getImages} from '../services/mediaServices';
import {compareSongs, getAdjoining, swipeHelper} from '../utils/helpers';

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
    setAudio(state, action) {
      return {...state, audio: action.payload};
    },

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
  setAudio,
  setAllImages,
  setViewImages,
  filterImages,
  setHighlight,
  setSwipeStart,
  setSwipeEnd,
} = mediaSlice.actions;

// packaged functions

// get all image + audio metadata (after entry)
export const initializeMedia = (entryToken) => {
  return async (dispatch) => {
    // only tries to initialize if there's an entry token
    if (entryToken) {
      // images
      const images = await getImages(entryToken);
      dispatch(setAllImages(images));
      dispatch(setViewImages(images));

      // audio
      const audio = await getAudio(entryToken);
      audio.sort(compareSongs);
      dispatch(setAudio(audio));

      // add audio tracks to queue
      await TrackPlayer.reset();
      const baseUrl = 'https://herrala-bricker-wedding.onrender.com/api/audio';
      audio.forEach(async (i) => {
        const thisTitle = i.fileName;
        const thisArtist = i.fileName === 'Mia2.1.mp3' ? 'Mia Bricker' : 'Adam Herrala Bricker'; // eslint-disable-line max-len
        await TrackPlayer.add({
          id: i.fileName,
          url: `${baseUrl}/${i.fileName}?token=${entryToken}`,
          title: thisTitle,
          artist: thisArtist,
          album: 'Sanna & Adam',
        });
      });
    }
  };
};

export default mediaSlice.reducer;
