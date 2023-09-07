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

const LoginForm = ({setUser, lan, setShowLogin}) => {
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
            console.log('this user', thisUser)
           
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
                <button className = 'generic-button' id = 'login-button' type='submit'>{text.login[lan]}</button>
                <button className = 'generic-button' onClick = {() => setShowLogin(false)}>{text.cancel[lan]}</button>  
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
        <button className = 'generic-button' onClick = {handleLogout}>{text.logout[lan]}</button>
    )
}

//group where login can be selected/displayed
const LoginSelect = ({setUser, lan}) => {
    const [showLogin, setShowLogin] = useState(false)

    return(
            showLogin
            ? <LoginForm setUser = {setUser} lan = {lan} setShowLogin = {setShowLogin}/>
            : <button className = 'generic-button' onClick = {() => setShowLogin(true)}>{text.login[lan]}</button>
    )
}

//root component for this module
//full user info component --> guest: login or create. logged in: display name + log out
const Login = ({user, setUser, guestUser, setEntryKey, lan, setLastScroll}) => {
    //event handler
    const handleExit = () => {
        setUser(guestUser)
        setEntryKey(null)
        setLastScroll(window.scroll(0,0))
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
            ? <LoginSelect lan = {lan} setUser = {setUser}/>
            : <LoggerOuter setUser = {setUser} guestUser = {guestUser} lan = {lan}/>}
            <button className = 'generic-button' onClick = {handleExit}>{text.exit[lan]}</button>
        </div>
    )
}

export default Login