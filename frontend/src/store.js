import { configureStore } from '@reduxjs/toolkit'
import notiReducer from './reducers/notiReducer'

const store = configureStore({
    reducer: {
        notification: notiReducer

    }

})

export default store