import {configureStore} from '@reduxjs/toolkit';
import mediaReducer from './reducers/mediaReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    media: mediaReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // added because of a warning in the console
    }),
});

export default store;
