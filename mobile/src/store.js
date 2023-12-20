import {configureStore} from '@reduxjs/toolkit';
import mediaReducer from './reducers/mediaReducer';
import sceneReducer from './reducers/sceneReducer';
import userReducer from './reducers/userReducer';
import viewReducer from './reducers/viewReducer';

const store = configureStore({
  reducer: {
    media: mediaReducer,
    scenes: sceneReducer,
    user: userReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // added because of a warning in the console
    }),
});

export default store;
