import { useState, useEffect } from 'react'
import text from '../resources/text'
import Notifier from './Notifier'
import imageServices from '../services/imageServices'
import audioServices from '../services/audioServices'
import sceneServices from '../services/sceneServices'
import userServices from '../services/userServices'

//root component for entry page
const Entry = ({setEntryKey}) => {
    const [enteredKey, setEnteredKey] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

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
            setErrorMessage(duoLingo('entryError'))
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            console.log('entry key is incorrect')
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
        <div>
            <h1>{duoLingo('header')}</h1>
            <h4>{duoLingo('entryKey')}</h4>
            <Notifier message = {errorMessage} />
            <form onSubmit = {checkKey}>
                <input name='entry' type = 'password' value = {enteredKey} onChange = {handleEntry} />
                <button type = 'submit'>enter</button>
            </form>
        </div>

    )
}

export default Entry