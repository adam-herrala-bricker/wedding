// handles lists of all media files (images + music)
// note that this is just the metadata, not the actual files themselves
import {createSlice} from '@reduxjs/toolkit';
import {resetLoaded} from './sceneReducer';
import {notifier, clearNotification} from './notiReducer';
import imageServices from '../services/imageServices';
import audioServices from '../services/audioServices';
import adminServices from '../services/adminServices';
import helpers from '../utilities/helpers';

// a list of all the images available on the DB (only the reducer uses this)
const defaultImagesAll = [];

// the images to render to the user (IMAGE COMPONENTS SHOULD ALWAYS SELECT THIS)
const defaultImagesDisplay = [];
const defaultMusic = [];

// note the structure!
const asObject = (imagesAll, imagesDisplay, music) => {
  return {images: {all: imagesAll, display: imagesDisplay}, music: music};
};

const mediaSlice = createSlice({
  name: 'media',

  initialState: asObject(defaultImagesAll, defaultImagesDisplay, defaultMusic),

  reducers: {
    setImagesAll(state, action) {
      return {...state, images: {...state.images, all: action.payload}};
    },

    displayAllImages(state) {
      return {...state, images: {...state.images, display: state.images.all}};
    },

    addImage(state, action) {
      const newImages = [...state.images.all, action.payload];
      newImages.sort(helpers.compareImages);

      return {...state, images: {...state.images, all: newImages}};
    },

    // filtering DISPLAY IMAGES ONLY
    filterImages(state, action) {
      const user = action.payload.user;
      const scene = action.payload.scene;

      // for admin user, 'all/kaikki' --> everything
      // even hidden images with no tags
      const filteredImages = (user.adminToken && scene.sceneName === 'scene-0')
                ? state.images.all
                // 'all/kakki' tag is required for visibilty on non-admin view
                : state.images.all.filter((i) => (
                  Object
                      .values(i.scenes)
                      .map((i) => i.id)
                      .includes(scene.id)
                  & Object
                      .values(i.scenes)
                      .map((i) => i.sceneName)
                      .includes('scene-0')));

      return {...state, images: {...state.images, display: filteredImages}};
    },

    // for updating after scene link/unlink (updates both all and display)
    changeImages(state, action) {
      const newImage = action.payload;
      const imagesAll = state.images.all;
      const imagesDisplay = state.images.display;

      const newImagesAll = [
        ...imagesAll.filter((i) => i.id !== newImage.id),
        newImage,
      ];

      const newImagesDisplay = [
        ...imagesDisplay.filter((i) => i.id !== newImage.id),
        newImage,
      ];

      newImagesAll.sort(helpers.compareImages);
      newImagesDisplay.sort(helpers.compareImages);

      return {...state, images: {all: newImagesAll, display: newImagesDisplay}};
    },

    removeImage(state, action) {
      const imageID = action.payload;
      const newImagesAll = state.images.all.filter((i) => i.id !== imageID);
      const newImagesDisplay = state.images.display
          .filter((i) => i.id !== imageID);

      return {...state, images: {all: newImagesAll, display: newImagesDisplay}};
    },

    setMusic(state, action) {
      return {...state, music: action.payload};
    },

    addSong(state, action) {
      const newSong = action.payload;
      const updatedSongs = [...state.music, newSong];

      updatedSongs.sort(helpers.compareSongs);

      return {...state, music: updatedSongs};
    },

    removeSong(state, action) {
      const songID = action.payload;
      const newSongs = state.music.filter((i) => i.id !== songID);

      newSongs.sort(helpers.compareSongs);

      return {...state, music: newSongs};
    },
  },
});

export const {
  setImagesAll,
  displayAllImages,
  addImage,
  filterImages,
  changeImages,
  removeImage,
  setMusic,
  addSong,
  removeSong,
} = mediaSlice.actions;

// packaged functions

export const initializeImages = (entryToken, adminToken) => {
  // note that the if statement needs to go INSIDE the return statement
  return async (dispatch) => {
  // only try initialize if the user has an entry token
  // (will still fail on BE if it's invalid)
    if (entryToken) {
      const responseData = await imageServices.getImageData();

      // allows for 'hidden' files only visible to admin
      // by removing from 'all' scene
      const imagesAll = adminToken
        ? responseData
        : responseData
            .filter((i) => i.scenes
                .map((i) => i.sceneName)
                .includes('scene-0'));

      imagesAll.sort(helpers.compareImages);
      dispatch(setImagesAll(imagesAll));

      // by default displaying all images
      dispatch(displayAllImages());
    }
  };
};

export const updateImages = (imageID, scenes) => {
  return async (dispatch) => {
    const newImage = await imageServices
        .updateImageData({id: imageID, scenes: scenes});

    dispatch(changeImages(newImage));
  };
};

export const deleteImage = (imageID) => {
  return async (dispatch) => {
    await adminServices.deleteImage(imageID);

    dispatch(removeImage(imageID));
  };
};

export const initializeMusic = (entryToken) => {
  return async (dispatch) => {
    //  also only try if user has an entry token
    if (entryToken) {
      const audioData = await audioServices.getAudioData();
      audioData.sort(helpers.compareSongs);

      dispatch(setMusic(audioData));
    }
  };
};

export const deleteSong = (songID) => {
  return async (dispatch) => {
    await adminServices.deleteAudio(songID);

    dispatch(removeSong(songID));
  };
};

export const uploadMedia = (file) => {
  return async (dispatch) => {
    try {
      // remove possible lingering notification from last attempt
      dispatch(clearNotification());

      // route for images
      if (file.type === 'image/png' | file.type === 'image/jpeg') {
        const newImage = await adminServices.postImage(file);

        // add image to images.all
        dispatch(addImage(newImage));

        // return to default scene after upload
        // (avoids confusion re. 'missing' uploads)
        dispatch(displayAllImages());
        dispatch(resetLoaded());

      // route for audio
      } else if (file.type === 'audio/wav'
          | file.type === 'audio/x-wav'
          | file.type === 'audio/mp3'
          | file.type === 'audio/mpeg') {
        const newAudio = await adminServices.postAudio(file);

        dispatch(addSong(newAudio));
      }
    } catch (error) {
      console.log(error.response.data.error);
      dispatch(notifier(error.response.data.error, 'error-message', 20));
    }
  };
};

export default mediaSlice.reducer;
