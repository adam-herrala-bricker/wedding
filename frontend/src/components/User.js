import {useState, useEffect} from 'react'
import userServices from '../services/userServices'
import adminServices from '../services/adminServices'

//component to display current user
const DisplayUser = ({user}) => {
    return(
        <div>
            {user.username}
        </div>
    )
}

const LoginForm = ({setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

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
            
            userServices.setToken(thisUser.token) //will probs need to move this to another services regular to one, admin to another
           
            if (thisUser.isAdmin) {
                adminServices.setAdminToken(thisUser.adminToken)
            }

            setUser(thisUser)
            setUsername('')
            setPassword('')
        }
        catch (exception) {
            //notifier('error', 'username or password incorrect')
            console.log('username or password is incorrect')
        }
    }

    return(
        <div>
            <h2>log in</h2>
            <form autoComplete='off' onSubmit = {handleLogin}>
                <div>
                    username <input name='Username' value={username} onChange = {handleFormChange}/>
                 </div>
                <div>
                    password <input name='Password' type='password' value={password} onChange = {handleFormChange}/>
                </div>
                <button id = 'login-button'type='submit'>login</button>  
            </form>
        </div>
    )
}

const LoggerOuter = ({setUser, guestUser}) => {
    //event handler
    const handleLogout = () => {
        setUser(guestUser)
        window.localStorage.clear()
    }

    return(
        <button onClick = {handleLogout}>logout</button>
    )
}

//root component for this module
//full user info component --> guest: login or create. logged in: display name + log out
const Login = ({user, setUser, guestUser}) => {

     //effect hook for keeping user logged in on refresh
     useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('userData')
        if (loggedUserJSON) {
          const thisUser = JSON.parse(loggedUserJSON)
          setUser(thisUser)
          userServices.setToken(thisUser.token) // need to change this too
          if (thisUser.isAdmin) {
            adminServices.setAdminToken(thisUser.adminToken)
          }
        }
      }, [])

    return(
        <div>
            <DisplayUser user= {user}/>
            {user.username === 'guest'
            ? <LoginForm setUser = {setUser}/>
            : <LoggerOuter setUser = {setUser} guestUser = {guestUser}/>}
            
        </div>
    )
}

export default Login