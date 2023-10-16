import { configureStore } from '@reduxjs/toolkit'
import notiReducer from './reducers/notiReducer'
import userReducer from './reducers/userReducer'
import viewReducer from './reducers/viewReducer'

const store = configureStore({
    reducer: {
        notification: notiReducer,
        user: userReducer,
        view: viewReducer
    }
})

export default store