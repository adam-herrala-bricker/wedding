// since the app is currently view-only, there isn't any need for
// user management beyond storing the entry token
// however, that could be added here at a later date as needed

import {createSlice} from '@reduxjs/toolkit';

// initial state
const defaultEntryToken = null;

const userSlice = createSlice({
  name: 'user',

  initialState: {entryToken: defaultEntryToken},

  reducers: {
    clearUser() {
      return {entryToken: defaultEntryToken};
    },

    setEntryToken(state, action) {
      return {...state, entryToken: action.payload};
    },
  },
});

export const {clearUser, setEntryToken} = userSlice.actions;

export default userSlice.reducer;
