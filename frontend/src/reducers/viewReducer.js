//reducer for assorted states that handle the view the user is given: language, scroll height, resolution!!, (more??)
import { createSlice } from '@reduxjs/toolkit'

//initial state
const defaultLan = 'suo'
const defaultScroll = 0

//helper for setting object
const asObject = (lan, scroll) => {
    return {lan, scroll}
}

//main slice
const viewSlice = createSlice({
    name: 'view',
    initialState: asObject(defaultLan, defaultScroll),
    reducers: {
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

export const { setLan, getScroll, setScroll } = viewSlice.actions

//helpful packaged functions

//scrolls to the last saved point
export const scrollLast = () => {
    return dispatch => {
        const thisScroll = dispatch(getScroll())

        window.scrollY(thisScroll)
    }
}

export default viewSlice.reducer