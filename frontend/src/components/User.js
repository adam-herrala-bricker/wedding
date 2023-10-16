import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Offcanvas } from 'react-bootstrap'
import { clearUser, login, logOut, setUser, setAdmin } from '../reducers/userReducer'
import { getText } from '../resources/text'
import Notifier from './Notifier'

const LoginForm = ({ setShowLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    //event handlers
    const handleFormChange = (event) => {
        const inputField = event.target.name
        inputField === 'Username' && setUsername(event.target.value)
        inputField === 'Password' && setPassword(event.target.value)
      }

    const handleLogin = async (event) => {
        event.preventDefault()
        dispatch(login(username, password))
    }

    return(
        <div className='login-container'>
            <h2>{getText('login')}</h2>
            <Notifier />
            <form autoComplete='off' onSubmit = {handleLogin}>
                <div className = 'user-input'>
                    {getText('username')} <input name='Username' value={username} onChange = {handleFormChange}/>
                 </div>
                <div className = 'user-input'>
                    {getText('password')} <input name='Password' type='password' value={password} onChange = {handleFormChange}/>
                </div>
                <div className = 'login-button-container'>
                    <button className = 'generic-button' id = 'login-button' type='submit'>{getText('login')}</button>
                    <button className = 'generic-button' onClick = {() => setShowLogin(false)}>{getText('cancel')}</button> 
                </div>
            </form>
        </div>
    )
}

const LoggerOuter = () => {
    const dispatch = useDispatch()
    //event handler
    const handleLogout = () => {
        dispatch(logOut())
    }

    return(
        <button className = 'generic-button' onClick = {handleLogout}>{getText('logout')}</button>
    )
}

//group where login can be selected/displayed
const LoginSelect = () => {
    const [showLogin, setShowLogin] = useState(false)

    return(
            showLogin
            ? <Offcanvas show = {showLogin} placement='end' style={{backgroundColor : 'rgb(234, 243, 238)'}}>
                <LoginForm setShowLogin = {setShowLogin} />
            </Offcanvas>
            : <button className = 'generic-button' onClick = {() => setShowLogin(true)}>{getText('login')}</button>
    )
}

//root component for this module
//full user info component --> guest: login or create. logged in: display name + log out
const Login = ({ setLastScroll}) => {
    const dispatch = useDispatch()
    const user = useSelector(i => i.user)

    //event handler
    const handleExit = () => {
        dispatch(clearUser())
    }

     //effect hook for keeping user logged in on refresh
     useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('userData')
        const thisUser = JSON.parse(loggedUserJSON)
        if (thisUser) {
            dispatch(setUser({
                username: thisUser.username,
                displayname: thisUser.displayName,
                userToken: thisUser.token
            }))
            
            if (thisUser.isAdmin) {
                dispatch(setAdmin(thisUser.adminToken))
            }
        }
      }, [])

    return(
        <div className = 'login-button-container'>
            {user.username === 'guest'
            ? <LoginSelect setLastScroll = {setLastScroll}/>
            : <LoggerOuter  setLastScroll = {setLastScroll}/>}
            <button className = 'generic-button' onClick = {handleExit}>{getText('exit')}</button>
        </div>
    )
}

export default Login