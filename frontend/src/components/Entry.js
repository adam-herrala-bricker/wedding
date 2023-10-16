import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { entryCheck, setEntryToken } from '../reducers/userReducer'
import text from '../resources/text'
import Notifier from './Notifier' //component

//root component for entry page
const Entry = () => {
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

        dispatch(entryCheck(enteredKey))

    }
    //effect hook to load entry token on refresh (just like loading a user)
    useEffect(() => {
        const entryKeyJSON = window.localStorage.getItem('entryKey')
        if (entryKeyJSON) {
            const thisKey = JSON.parse(entryKeyJSON)

            if (thisKey) {
                dispatch(setEntryToken(thisKey.token))
            }
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