import { useState, useEffect } from 'react'
import imageServices from '../services/imageServices'
import userServices from '../services/userServices'

//root component for entry page
const Entry = ({setEntryKey}) => {
    const [enteredKey, setEnteredKey] = useState('')

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
            setEntryKey(thisKey)
        }
        catch (exception) {
            //notifier('error', 'username or password incorrect')
            console.log('username or password is incorrect')
        }
    }
    //effect hook to load entry token on refresh (just like loading a user)
    useEffect(() => {
        const entryKeyJSON = window.localStorage.getItem('entryKey')
        if (entryKeyJSON) {
            const thisKey = JSON.parse(entryKeyJSON)
            imageServices.setEntryToken(thisKey.token)
            setEntryKey(thisKey)
        }
    }, [])

    return(
        <div>
            <h1>Herrala Bricker wedding entry page</h1>
            <h4>entry key</h4>
            <form onSubmit = {checkKey}>
                <input name='entry' type = 'password' value = {enteredKey} onChange = {handleEntry} />
                <button type = 'submit'>enter</button>
            </form>
        </div>

    )
}

export default Entry