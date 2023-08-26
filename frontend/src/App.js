import { useState, useEffect} from 'react'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Images from './components/Images'
import imageServices from './services/imageServices'

const App = () => {
  const guestUser = {displayname: 'guest', username: 'guest'}
  const [user, setUser] = useState(guestUser) //here bc will need to pass this to basically every component
  const [imageList, setImageList] = useState([])

  //effect hook to load image list on first render, plus whenever the upload images change
  //(need to put the async inside so it doesn't throw an error)
  const setImageFiles = () => {
    const fetchData = async () => {
        const response = await imageServices.getImageData()
        setImageList(response)
    }
    fetchData()
  }

  useEffect(setImageFiles, []) //need to figure out how to handle refresh

  return(
    <div>
      <div className='flexbox-container'>
        <h1>Herrala Bricker Wedding</h1>
        <User user = {user} setUser = {setUser} guestUser = {guestUser}/>
      </div>
      {user.isAdmin && <ImageUpload setImageList = {setImageList}/>}
      <Images imageList={imageList} setImageList = {setImageList} user = {user}/>
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
