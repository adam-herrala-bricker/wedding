// reducer for handling notifications
import {createSlice} from '@reduxjs/toolkit';

const defaultMessage = null;
const defaultType = null;
const defaultTimeoutID = null;

// helper function to make notification object
const asObject = (message, type, timeoutID) => {
  return {message, type, timeoutID};
};

// main slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState: asObject(defaultMessage, defaultType, defaultTimeoutID),
  reducers: {
    setMessage(state, action) {
    // keeps stable when mashing notifications
      const lastTimeoutID = state.timeoutID;
      clearTimeout(lastTimeoutID);

      return {
        ...state,
        message: action.payload.message,
        type: action.payload.type,
      };
    },

    setLastTimeoutID(state, action) {
      return ({...state, timeoutID: action.payload});
    },

    clearNotification() {
      return (asObject(defaultMessage, defaultType, defaultTimeoutID));
    },
  },
});

export const {
  setMessage,
  setLastTimeoutID,
  clearNotification,
} = notificationSlice.actions;

// package in nice function for export to components (duration is in seconds)
export const notifier = (message, type, duration) => {
  return (dispatch) => {
    dispatch(setMessage({message: message, type: type}));

    const thisTimeoutID = setTimeout(() => {
      dispatch(clearNotification());
    }, duration*1000);

    setLastTimeoutID(thisTimeoutID);
  };
};

export default notificationSlice.reducer;
