import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Offcanvas} from 'react-bootstrap';
import {clearUser,
  login,
  logOut,
  setUser,
  setAdmin,
} from '../reducers/userReducer';
import Notifier from './Notifier';

const LoginForm = ({setShowLogin}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const textLan = useSelector((i) => i.view.textLan);

  const dispatch = useDispatch();

  // event handlers
  const handleFormChange = (event) => {
    const inputField = event.target.name;
    inputField === 'Username' && setUsername(event.target.value);
    inputField === 'Password' && setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <div className='login-container'>
      <h2>{textLan.login}</h2>
      <Notifier />
      <form autoComplete='off' onSubmit = {handleLogin}>
        <div className = 'user-input'>
          {textLan.username}
          <input
            name='Username'
            value={username}
            onChange = {handleFormChange}/>
        </div>
        <div className = 'user-input'>
          {textLan.password}
          <input
            name='Password'
            type='password'
            value={password}
            onChange = {handleFormChange}/>
        </div>
        <div className = 'login-button-container'>
          <button
            className = 'generic-button'
            id = 'login-button'
            type='submit'>
            {textLan.login}
          </button>
          <button
            className = 'generic-button'
            onClick = {() => setShowLogin(false)}>
            {textLan.cancel}
          </button>
        </div>
      </form>
    </div>);
};

const LoggerOuter = () => {
  const textLan = useSelector((i) => i.view.textLan);
  const dispatch = useDispatch();

  // event handler
  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <button className = 'generic-button' onClick = {handleLogout}>
      {textLan.logout}
    </button>);
};

// group where login can be selected/displayed
const LoginSelect = () => {
  const [showLogin, setShowLogin] = useState(false);
  const textLan = useSelector((i) => i.view.textLan);

  return (
    showLogin
      ? <Offcanvas
        show = {showLogin}
        placement='end'
        style={{backgroundColor: 'rgb(234, 243, 238)'}}>
        <LoginForm setShowLogin = {setShowLogin} />
      </Offcanvas>
      : <button
        className = 'generic-button'
        onClick = {() => setShowLogin(true)}>
        {textLan.login}
      </button>);
};

// root component for this module
// full user info component --> guest: login or create.
// logged in: display name + log out
const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((i) => i.user);
  const textLan = useSelector((i) => i.view.textLan);

  // event handler
  const handleExit = () => {
    dispatch(clearUser());
  };

  // effect hook for keeping user logged in on refresh
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userData');
    const thisUser = JSON.parse(loggedUserJSON);
    if (thisUser) {
      dispatch(setUser({
        username: thisUser.username,
        displayname: thisUser.displayName,
        userToken: thisUser.token,
      }));

      if (thisUser.isAdmin) {
        dispatch(setAdmin(thisUser.adminToken));
      }
    }
  }, []);

  return (
    <div className = 'login-button-container'>
      {user.username === 'guest'
        ? <LoginSelect />
        : <LoggerOuter />}
      <button
        className = 'generic-button'
        onClick = {handleExit}>
        {textLan.exit}
      </button>
    </div>);
};

export default Login;
