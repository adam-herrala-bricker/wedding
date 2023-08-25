import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import User from './components/User'

const App = () => {
  const guestUser = {displayname: 'guest', username: 'guest'}
  const [user, setUser] = useState(guestUser) //here bc will need to pass this to basically every component

  return(
    <div>
      <h1>Herrala Bricker Wedding</h1>
      <User user = {user} setUser = {setUser} guestUser = {guestUser}/>
      <ImageUpload />
    </div>
    
  )
}

export default App;
