import {useState, useEffect} from 'react'
import text from '../resources/text'
import Notifier from './Notifier'
import userServices from '../services/userServices'
import adminServices from '../services/adminServices'

//component to display current user
const DisplayUser = ({user, lan}) => {
    return(
        <div>
            {user.username === 'guest'
                ? text.guest[lan]
                : user.username}
        </div>
    )
}

const LoginForm = ({setUser, lan}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    //event handlers
    const handleFormChange = (event) => {
        const inputField = event.target.name
        inputField === 'Username' && setUsername(event.target.value)
        inputField === 'Password' && setPassword(event.target.value)
      }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const thisUser = await userServices.login({username, password})
            window.localStorage.setItem('userData', JSON.stringify(thisUser))
            
            //userServices.setToken(thisUser.token)
           
            if (thisUser.isAdmin) {
                adminServices.setAdminToken(thisUser.adminToken)
            }

            setUser(thisUser)
            setUsername('')
            setPassword('')
        }
        catch (exception) {
            setErrorMessage(text.loginError[lan])
            setTimeout(() => {
                setErrorMessage(null)
            },  5000)
            console.log('username or password is incorrect')
        }
    }

    return(
        <div >
            <h2>{text.login[lan]}</h2>
            {errorMessage && <Notifier message = {errorMessage}/>}
            <form autoComplete='off' onSubmit = {handleLogin}>
                <div className = 'user-input'>
                    {text.username[lan]} <input name='Username' value={username} onChange = {handleFormChange}/>
                 </div>
                <div className = 'user-input'>
                    {text.password[lan]} <input name='Password' type='password' value={password} onChange = {handleFormChange}/>
                </div>
                <button id = 'login-button'type='submit'>{text.login[lan]}</button>  
            </form>
        </div>
    )
}

const LoggerOuter = ({setUser, guestUser, lan}) => {
    //event handler
    const handleLogout = () => {
        setUser(guestUser)
        window.localStorage.removeItem('userData')
    }

    return(
        <button onClick = {handleLogout}>{text.logout[lan]}</button>
    )
}

//root component for this module
//full user info component --> guest: login or create. logged in: display name + log out
const Login = ({user, setUser, guestUser, setEntryKey, lan}) => {
    //event handler
    const handleExit = () => {
        setUser(guestUser)
        setEntryKey(null)
        window.localStorage.clear()
    }

     //effect hook for keeping user logged in on refresh
     useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('userData')
        if (loggedUserJSON) {
          const thisUser = JSON.parse(loggedUserJSON)
          setUser(thisUser)
          // userServices.setToken(thisUser.token)
          if (thisUser.isAdmin) {
            adminServices.setAdminToken(thisUser.adminToken)
          }
        }
      }, [])

    return(
        <div>
            <DisplayUser user= {user} lan = {lan}/>
            {user.username === 'guest'
            ? <LoginForm setUser = {setUser} lan = {lan}/>
            : <LoggerOuter setUser = {setUser} guestUser = {guestUser} lan = {lan}/>}
            <button onClick = {handleExit}>{text.exit[lan]}</button>
        </div>
    )
}

export default Login