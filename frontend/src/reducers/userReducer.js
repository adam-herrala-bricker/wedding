import {createSlice} from '@reduxjs/toolkit';
import {notifier, clearNotification} from './notiReducer';
import {setScroll} from './viewReducer';
import {getText} from '../resources/text';
import userServices from '../services/userServices';
import dictionary from '../resources/dictionary';

// initial state
const defaultUsername = 'guest';
const defaultDisplayname = 'guest';

const defaultEntryToken = null;
const defaultUserToken = null;
const defaultAdminToken = null;

// not part of the state, just used for the request to get an entry token
const entryUsername = 'entry';

// helper function to get object
const asObject = (username, displayname, entryToken, userToken, adminToken) => {
  return {username, displayname, entryToken, userToken, adminToken};
};

const userSlice = createSlice({
  name: 'user',

  initialState: asObject(
      defaultUsername,
      defaultDisplayname,
      defaultEntryToken,
      defaultUserToken,
      defaultAdminToken),

  reducers: {
    // clears all user data in the store (and local storage)
    clearUser() {
      window.localStorage.clear();
      return asObject(
          defaultUsername,
          defaultDisplayname,
          defaultEntryToken,
          defaultUserToken,
          defaultAdminToken);
    },

    // reverts to guest user but keeps keeps entry token
    guestUser(state) {
      window.localStorage.removeItem('userData');
      return {
        username: defaultUsername,
        displayname: defaultDisplayname,
        entryToken: state.entryToken,
        userToken: defaultUserToken,
        adminToken: defaultAdminToken,
      };
    },

    setEntryToken(state, action) {
      return {...state, entryToken: action.payload};
    },

    setUser(state, action) {
      return {
        ...state,
        username: action.payload.username,
        displayname: action.payload.displayname,
        userToken: action.payload.userToken};
    },

    setAdmin(state, action) {
      return {...state, adminToken: action.payload};
    },
  },
});

export const {
  clearUser,
  guestUser,
  setEntryToken,
  setUser,
  setAdmin,
} = userSlice.actions;

// packaged functions for components

// checking entry key to view main site
export const entryCheck = (entryKey) => {
  return async (dispatch) => {
    try {
      // entry authenticates like a user named 'entry'
      const thisKey = await userServices.login({
        username: entryUsername,
        password: entryKey,
      });

      // save the entry token
      dispatch(setEntryToken(thisKey.token));
      window.localStorage.setItem('entryKey', JSON.stringify(thisKey));

      // clear any lingering notifications
      dispatch(clearNotification());
    } catch (exception) {
      dispatch(notifier(`${dictionary['entryError'].suo} // ${dictionary['entryError'].eng}`, // eslint-disable-line max-len
          'error-message', 5));
    }
  };
};

// logging users in
export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const thisUser = await userServices.login({username, password});
      dispatch(setUser({
        username: username,
        password: password,
        userToken: thisUser.token}));
      window.localStorage.setItem('userData', JSON.stringify(thisUser));

      dispatch(setScroll(window.scrollY));

      if (thisUser.isAdmin) {
        dispatch(setAdmin(thisUser.adminToken));
      }
      // clear any lingering notifications
      dispatch(clearNotification());
    } catch (except) {
      dispatch(notifier(getText('loginError'), 'error-message', 5));
    }
  };
};

export const logOut = () => {
  return (dispatch) => {
    dispatch(guestUser());
    dispatch(setScroll(window.scrollY));
    dispatch(clearNotification()); // clear any lingering notifications
  };
};

export default userSlice.reducer;
