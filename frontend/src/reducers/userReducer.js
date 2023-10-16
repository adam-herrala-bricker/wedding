import { createSlice } from '@reduxjs/toolkit'
import { notifier } from './notiReducer'
import userServices from '../services/userServices'

//initial state
const defaultUsername = 'guest'
const defaultDisplayname = 'guest'

const defaultEntryToken = null
const defaultUserToken = null
const defaultAdminToken = null

//not part of the state, just used for the request to get an entry token
const entryUsername = 'entry'

//helper function to get object
const asObject = (username, displayname, entryToken, userToken, adminToken) => {
    return {username, displayname, entryToken, userToken, adminToken}
}

const userSlice = createSlice({
    name: 'user',
    initialState: asObject(
        defaultUsername, 
        defaultDisplayname, 
        defaultEntryToken,
        defaultUserToken,
        defaultAdminToken),
    
    reducers: {
        //clears all user data in the store
        clearUser() {

            window.localStorage.clear()

            return asObject(
                defaultUsername, 
                defaultDisplayname, 
                defaultEntryToken,
                defaultUserToken,
                defaultAdminToken)
        },

        //logs out but keeps entry token
        logOut(state) {
            
            window.localStorage.removeItem('userData')
            
            return {
                username: defaultUsername,
                displayname: defaultDisplayname,
                entryToken: state.entryToken,
                userToken: defaultUserToken,
                adminToken: defaultAdminToken
            }
        },

        setEntryToken(state, action) {
            return {...state, entryToken: action.payload}
        },

        setUser(state, action) {
            return {
                ...state, 
                username: action.payload.username, 
                displayname: action.payload.displayname, 
                userToken: action.payload.userToken}
        },

        setAdmin(state, action) {
            return {...state, adminToken: action.payload}
        }
    }
})

export const { clearUser, logOut, setEntryToken, setUser, setAdmin} = userSlice.actions

//packaged functions for components

//checking entry key to view main site
export const entryCheck = (entryKey) => {
    return async dispatch => {
        try {
            //entry authenticates like a user named 'entry'
            const thisKey = await userServices.login({username: entryUsername, password: entryKey})
            dispatch(setEntryToken(thisKey.token))
            window.localStorage.setItem('entryKey', JSON.stringify(thisKey))
        } catch (exception) {
            dispatch(notifier('entry key is incorrect', 'error-message', 5))
        }
    }
}

//logging users in
export const login = (username, password) => {
    return async dispatch => {
        try {
            const thisUser = await userServices.login({username, password})
            dispatch(setUser({username: username, password: password, userToken: thisUser.token}))
            window.localStorage.setItem('userData', JSON.stringify(thisUser))

            if (thisUser.isAdmin) {
                dispatch(setAdmin(thisUser.adminToken))
            }

        } catch (except) {
            dispatch(notifier('placeholder warning', 'error-message', 5))
        }
    }
}



export default userSlice.reducer
