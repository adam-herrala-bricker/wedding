//reducer for assorted states that handle the view the user is given: language, scroll height, resolution!!, (more??)
import { createSlice } from '@reduxjs/toolkit'
import text from '../resources/text'

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
        getLan(state) {
            return state.lan
        },

        setLan(state, action) {
            return {...state, lan: action.payload}
        },

        getScroll(state) {
            return state.scroll
        },

        setScroll(state, action) {
            return {...state, scroll: action.payload}
        }

    }
})

export const { getLan, setLan, getScroll, setScroll } = viewSlice.actions

//helpful packaged functions
//scrolls to the last saved point
export const scrollLast = () => {
    return dispatch => {
        const thisScroll = dispatch(getScroll())

        window.scrollY(thisScroll)
    }
}

export default viewSlice.reducer