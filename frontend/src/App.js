import { useState, useEffect } from 'react'
import text from './resources/text.js'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Music from './components/Music'
import Images from './components/Images'
import Entry from './components/Entry'
import CustomNavbar from './components/CustomnNavbar.js'
import Language from './components/Language'
import HighlightView from './components/HighlightView.js'
import imageServices from './services/imageServices'
import helpers from './utilities/helpers'
import { Button, Navbar } from 'react-bootstrap'

//component for regular view
const RegularView = ({ guestUser, user, setUser, imageList, setImageList, lastScroll, setLastScroll, highlight, setHighlight, setEntryKey, lan, setLan }) => {
  const [scenes, setScenes] = useState([]) //list of all the scenes

  //effect hook to load image list on first render, plus whenever the upload images change
  //(need to put the async inside so it doesn't throw an error)
  const setImageFiles = () => {
    const fetchData = async () => {
      const response = await imageServices.getImageData()

      //allows for 'hidden' files only visible to admin by removing from 'all' scene
      const newImageList = user.isAdmin
        ? response
        : response.filter(i => i.scenes.map(i => i.sceneName).includes('scene-0'))

      newImageList.sort(helpers.compareImages)
      setImageList(newImageList)
    }
    fetchData()
  }

  useEffect(setImageFiles, [user])


  return (
    <div>
      <CustomNavbar lan={lan} setLan={setLan} user={user} setUser={setUser} guestUser={guestUser} setEntryKey={setEntryKey}></CustomNavbar>
      {user.isAdmin && <ImageUpload setImageList={setImageList} />}
      <section>
        <h1>Thank you for celebrating with us on July 15th!</h1>
        <h2>Here is a little throwback to the big day.</h2>
      </section>
      <section id='music'>
        <Music user={user} lan={lan} />
      </section>
      <Images lastScroll={lastScroll} setLastScroll={setLastScroll} id='images' scenes={scenes} setScenes={setScenes} imageList={imageList} setImageList={setImageList} user={user} highlight={highlight} setHighlight={setHighlight} lan={lan} />
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
  const guestUser = { displayname: 'guest', username: 'guest' }
  const [highlight, setHighlight] = useState({ current: null, outgoing: null })
  const [entryKey, setEntryKey] = useState(null)
  const [lan, setLan] = useState('suo')
  const [lastScroll, setLastScroll] = useState(0)//for scrolling to same part of page after highlight
  const [imageList, setImageList] = useState([])
  const [user, setUser] = useState(guestUser)


  return (
    <div className='container'>
      {entryKey
        ? highlight.current === null
          ? <RegularView guestUser={guestUser} user={user} setUser={setUser} imageList={imageList} setImageList={setImageList} lastScroll={lastScroll} setLastScroll={setLastScroll} highlight={highlight} setHighlight={setHighlight} setEntryKey={setEntryKey} lan={lan} setLan={setLan} />
          : <HighlightView imageList={imageList} highlight={highlight} setHighlight={setHighlight} lan={lan} />
        : <Entry setEntryKey={setEntryKey} />
      }

    </div>

  )

}


export default App;
