import { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Images from './components/Images'

const App = () => {
  const guestUser = {displayname: 'guest', username: 'guest'}
  const [user, setUser] = useState(guestUser) //here bc will need to pass this to basically every component

  return(
    <div>
      <div className='flexbox-container'>
        <h1>Herrala Bricker Wedding</h1>
        <User user = {user} setUser = {setUser} guestUser = {guestUser}/>
      </div>
      {user.isAdmin && <ImageUpload />}
      <Images />
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>
      <h1>F</h1>

    </div>
    
  )
}

export default App;
