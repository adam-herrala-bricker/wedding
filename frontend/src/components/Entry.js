import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { notifier } from '../reducers/notiReducer' //reducer function
import text from '../resources/text'
import Notifier from './Notifier' //component
import imageServices from '../services/imageServices'
import audioServices from '../services/audioServices'
import sceneServices from '../services/sceneServices'
import userServices from '../services/userServices'

//root component for entry page
const Entry = ({setEntryKey}) => {
    const [enteredKey, setEnteredKey] = useState('')

    const dispatch = useDispatch()

    //helper function for dual-lan text
    const duoLingo = (phrase) => {
        return(`${text[phrase].suo} // ${text[phrase].eng}`)
    }

    //event handers
    const handleEntry = (event) => {
        setEnteredKey(event.target.value)
    }

    const checkKey = async (event) => {
        event.preventDefault()

        //entry authenticates like they're logging on to a user called 'entry'
        const username = 'entry'
        const password = enteredKey
        try {
            const thisKey = await userServices.login({username, password})
            window.localStorage.setItem('entryKey', JSON.stringify(thisKey))
            imageServices.setEntryToken(thisKey.token)
            audioServices.setEntryToken(thisKey.token)
            sceneServices.setEntryToken(thisKey.token)
            setEntryKey(thisKey)
        }
        catch (exception) {
            dispatch(notifier('entry key is incorrect', 'error-message', 5))
        }
    }
    //effect hook to load entry token on refresh (just like loading a user)
    useEffect(() => {
        const entryKeyJSON = window.localStorage.getItem('entryKey')
        if (entryKeyJSON) {
            const thisKey = JSON.parse(entryKeyJSON)
            imageServices.setEntryToken(thisKey.token)
            audioServices.setEntryToken(thisKey.token)
            sceneServices.setEntryToken(thisKey.token)
            setEntryKey(thisKey)
        }
    }, [])

    return(
        <div className = 'entry-container'>
            <h1>{duoLingo('header')}</h1>
            <div>
                <h4>{duoLingo('entryKey')}</h4>
                <Notifier />
                <form onSubmit = {checkKey}>
                    <input name='entry' type = 'password' value = {enteredKey} onChange = {handleEntry} />
                    <div>
                        <button className = 'generic-button' type = 'submit'>{duoLingo('enter')}</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Entry