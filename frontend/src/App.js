import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
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

//component to display current user
const DisplayUser = ({ user, lan, setLan, setLastScroll}) => {
  return (
    <div className='user-container'>
      <Language setLan = {setLan} setLastScroll = {setLastScroll}/>
      {user.username === 'guest'
        ? text.guest[lan]
        : user.username}
    </div>
  )
}

//component for regular view
const RegularView = ({ loadedScene, setLoadedScene, scenes, setScenes, guestUser, user, setUser, imageList, setImageList, lastScroll, setLastScroll, highlight, setHighlight, setEntryKey, lan, setLan }) => {
  const [music, setMusic] = useState([]) //metadata for the music


  return (
    <div>
      <DisplayUser user={user} lan={lan} setLan = {setLan} setLastScroll = {setLastScroll}/>
      <CustomNavbar lan={lan} setLan={setLan} user={user} setUser={setUser} guestUser={guestUser} setEntryKey={setEntryKey} setLastScroll={setLastScroll}></CustomNavbar>
      {user.isAdmin && <ImageUpload setImageList={setImageList} />}
      <section id='headingsSection'>
        <div>
          <h1>{text.welcomeTxt[lan]}</h1>
        </div>
        <h2>{text.welcomeSubTxt[lan]}</h2>
      </section>
      <section id='music'>
        <Music user={user} lan={lan} music={music} setMusic={setMusic} />
      </section>
      <Images loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} lastScroll={lastScroll} setLastScroll={setLastScroll} id='images' scenes={scenes} setScenes={setScenes} imageList={imageList} setImageList={setImageList} user={user} highlight={highlight} setHighlight={setHighlight} lan={lan} />
    </div>

  )
}

//Need seperate, stable post-entry component so that image data doesn't reload on every exit from highlight view (that would erase any filtering applied)
//but doesn't load when you're on the entry page
const PostEntry = ( {loadedScene, setLoadedScene, scenes, setScenes, guestUser, user, setUser, imageList, setImageList, lastScroll, setLastScroll, highlight, setHighlight, setEntryKey, lan, setLan}) => {
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

  return(
    highlight.current === null
      ? <RegularView loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} scenes = {scenes} setScenes = {setScenes} guestUser={guestUser} user={user} setUser={setUser} imageList={imageList} setImageList={setImageList} lastScroll={lastScroll} setLastScroll={setLastScroll} highlight={highlight} setHighlight={setHighlight} setEntryKey={setEntryKey} lan={lan} setLan={setLan} />
      : <HighlightView imageList={imageList} highlight={highlight} setHighlight={setHighlight} lan={lan} />
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
  const [scenes, setScenes] = useState([]) //list of all the scenes
  const [loadedScene, setLoadedScene] = useState(null) //currently selected scene to display


  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={
          entryKey
            ? <PostEntry loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} scenes = {scenes} setScenes = {setScenes} guestUser={guestUser} user={user} setUser={setUser} imageList={imageList} setImageList={setImageList} lastScroll={lastScroll} setLastScroll={setLastScroll} highlight={highlight} setHighlight={setHighlight} setEntryKey={setEntryKey} lan={lan} setLan={setLan}/>
            : <Entry setEntryKey={setEntryKey} />
        } />
      </Routes>


    </div>

  )

}


export default App;
