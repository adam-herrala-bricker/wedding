import { useState, useEffect} from 'react'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Images from './components/Images'
import Entry from './components/Entry'
import imageServices from './services/imageServices'

//component for highlighting a single image
//NOTE: may want to eventually move to own module to add under-image features
const HighlightView = ({highlight, setHighlight}) => {
  const baseURL = '/api/images'
  return(
    <div className = 'highlight-background'>
      <button onClick = {() => setHighlight(null)}>exit</button>
      <img className = 'highlight-image' alt = '' src = {`${baseURL}/${highlight.fileName}`}/>
    </div>
  )

}

//component for regular view
const RegularView = ({setHighlight, setEntryKey}) => {
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

  useEffect(setImageFiles, [])

  return(
    <div>
      <div className='flexbox-header'>
        <h1>Herrala Bricker Wedding</h1>
        <User user = {user} setUser = {setUser} guestUser = {guestUser} setEntryKey = {setEntryKey}/>
      </div>
      {user.isAdmin && <ImageUpload setImageList = {setImageList}/>}
      <Images imageList={imageList} setImageList = {setImageList} user = {user} setHighlight = {setHighlight}/>
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

//root component
const App = () => {
  const [highlight, setHighlight] = useState(null)
  const [entryKey, setEntryKey] = useState(null)


  return(
    <>
      {entryKey
        ? highlight === null
          ? <RegularView setHighlight = {setHighlight} setEntryKey = {setEntryKey}/>
          : <HighlightView highlight = {highlight} setHighlight = {setHighlight}/>
        : <Entry setEntryKey = {setEntryKey}/>
      }
      
    </>

  )

}


export default App;
