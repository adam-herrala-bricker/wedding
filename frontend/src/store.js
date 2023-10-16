import { configureStore } from '@reduxjs/toolkit'
import notiReducer from './reducers/notiReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        notification: notiReducer,
        user: userReducer
    }
})

export default store