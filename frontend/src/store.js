import {configureStore} from '@reduxjs/toolkit';
import notiReducer from './reducers/notiReducer';
import userReducer from './reducers/userReducer';
import viewReducer from './reducers/viewReducer';
import sceneReducer from './reducers/sceneReducer';
import mediaReducer from './reducers/mediaReducer';

const store = configureStore({
  reducer: {
    notification: notiReducer,
    user: userReducer,
    view: viewReducer,
    scenes: sceneReducer,
    media: mediaReducer,
  },
});

export default store;
