// reducer for misc view states
// (language + notififcations + image scroll index)
import {createSlice} from '@reduxjs/toolkit';

// default state
const defaultNotification = null;
const defaultIsError = false; // if there's an error
const defaultLanguage = 'suo';
const defaultScrollIndex = 0;

const viewSlice = createSlice({
  name: 'view',

  initialState: {
    notification: defaultNotification,
    isError: defaultIsError,
    language: defaultLanguage,
    scrollIndex: defaultScrollIndex,
  },

  reducers: {
    setNotification(state, action) {
      return {...state, notification: action.payload};
    },

    errorMode(state) {
      return {...state, isError: true};
    },

    clearNotification(state) {
      return {
        ...state,
        notification: defaultNotification,
        isError: defaultIsError,
      };
    },

    setLanguage(state, action) {
      return {...state, language: action.payload};
    },

    // this only works because we have exactly two languages
    switchLanguage(state) {
      const switionary = {suo: 'eng', eng: 'suo'}; // dictionary for switching
      const oldLanguage = state.language;

      return {...state, language: switionary[oldLanguage]};
    },

    setScrollIndex(state, action) {
      return {...state, scrollIndex: action.payload};
    },
  },
});

export const {
  setNotification,
  errorMode,
  clearNotification,
  setLanguage,
  switchLanguage,
  setScrollIndex,
} = viewSlice.actions;

export default viewSlice.reducer;

// fun packaged function for notifying (duration is in seconds)
export const notifier = (message, isError, duration) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    if (isError) {
      dispatch(errorMode());
    }
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000);
  };
};
