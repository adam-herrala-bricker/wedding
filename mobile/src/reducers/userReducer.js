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

// packaged function for checking entry key to enter app
export const entryCheck = (entryKey) => {
  return async (dispatch) => {
    const response = await fetch('https://herrala-bricker-wedding.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'entry',
        password: entryKey,
      }),
    });

    const body = await response.json();
    dispatch(setEntryToken(body.token));
  };
};

export default userSlice.reducer;
