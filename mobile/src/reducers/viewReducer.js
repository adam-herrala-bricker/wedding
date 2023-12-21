// reducer for misc view states
// (language + notififcations + image scroll index)
import {createSlice} from '@reduxjs/toolkit';

// default state
const defaultNotification = null;
const defaultLanguage = 'suo';
const defaultScrollIndex = 0;

const viewSlice = createSlice({
  name: 'view',

  initialState: {
    notification: defaultNotification,
    language: defaultLanguage,
    scrollIndex: defaultScrollIndex,
  },

  reducers: {
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
  setLanguage,
  switchLanguage,
  setScrollIndex,
} = viewSlice.actions;

export default viewSlice.reducer;
