// reducer for misc view states (language + notififcations)
import {createSlice} from '@reduxjs/toolkit';

// default state
const defaultNotification = null;
const defaultLanguage = 'suo';

const viewSlice = createSlice({
  name: 'view',

  initialState: {
    notification: defaultNotification,
    language: defaultLanguage,
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
  },
});

export const {setLanguage, switchLanguage} = viewSlice.actions;

export default viewSlice.reducer;
