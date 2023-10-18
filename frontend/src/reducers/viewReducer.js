//reducer for assorted states that handle the view the user is given: language, scroll height, resolution
import { createSlice } from '@reduxjs/toolkit'

//initial state
const defaultLan = 'suo' //options are 'suo' or 'eng'
const defaultRes = 'web' //options are 'web' or 'high'
const defaultScroll = 0

//helper for setting object
const asObject = (lan, res, scroll) => {
    return {lan, res, scroll}
}

//main slice
const viewSlice = createSlice({
    name: 'view',
    initialState: asObject(defaultLan, defaultRes, defaultScroll),
    reducers: {
        setLan(state, action) {
            return {...state, lan: action.payload}
        },

        setScroll(state, action) {
            return {...state, scroll: action.payload}
        },

        setRes(state, action) {
            return {...state, res: action.payload}
        }
    }
})

export const { setLan, setScroll, setRes } = viewSlice.actions

export default viewSlice.reducer