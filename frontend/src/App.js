import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getText } from './resources/text.js'
import ImageUpload from './components/ImageUpload'
import Music from './components/Music'
import Images from './components/Images'
import Entry from './components/Entry'
import CustomNavbar from './components/CustomnNavbar.js'
import Language from './components/Language'
import HighlightView from './components/HighlightView.js'
import imageServices from './services/imageServices'
import helpers from './utilities/helpers'

//component to display current user
const DisplayUser = () => {
  const user = useSelector(i => i.user)

  return (
    <div className='user-container'>
      <Language />
      {user.username === 'guest'
        ? getText('guest')
        : user.username}
    </div>
  )
}

//component for regular view
const RegularView = ({ res, setRes, loadedScene, setLoadedScene, scenes, setScenes, imageList, setImageList }) => {
  const [music, setMusic] = useState([]) //metadata for the music
  const user = useSelector(i => i.user)

  const lastScroll = useSelector(i => i.view.scroll)

  //note the scroll just goes here
  window.scroll({ left: 0, top: lastScroll, behavior: 'instant' })


  return (
    <div>
      <DisplayUser />
      <CustomNavbar ></CustomNavbar>
      {user.adminToken && <ImageUpload setImageList={setImageList} />}
      <section id='headingsSection'>
        <div>
          <h1>{getText('welcomeTxt')}</h1>
        </div>
        <h2>{getText('welcomeSubTxt')}</h2>
      </section>
      <section id='music'>
        <Music music={music} setMusic={setMusic} />
      </section>
      <Images res = {res} setRes = {setRes} loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} id='images' scenes={scenes} setScenes={setScenes} imageList={imageList} setImageList={setImageList} />
    </div>

  )
}

//Need seperate, stable post-entry component so that image data doesn't reload on every exit from highlight view (that would erase any filtering applied)
//but doesn't load when you're on the entry page
//UPDATE: CAN PROBABLY REMOVE THIS ONCE THE REDUX REFACTOR IS COMPLETE
const PostEntry = ( {loadedScene, setLoadedScene, scenes, setScenes, guestUser, imageList, setImageList}) => {
  const [res, setRes] = useState('web') //two options are 'web' or 'high'
  const user = useSelector(i => i.user)

  //effect hook to load image list on first render, plus whenever the upload images change
  //(need to put the async inside so it doesn't throw an error)
  const setImageFiles = () => {
    const fetchData = async () => {
      const response = await imageServices.getImageData()

      //allows for 'hidden' files only visible to admin by removing from 'all' scene
      const newImageList = user.adminToken
        ? response
        : response.filter(i => i.scenes.map(i => i.sceneName).includes('scene-0'))

      newImageList.sort(helpers.compareImages)
      setImageList(newImageList)
    }
    
    fetchData()
  
  }

  useEffect(setImageFiles, [user])

  return(
      <RegularView res = {res} setRes = {setRes} loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} scenes = {scenes} setScenes = {setScenes} guestUser={guestUser} imageList={imageList} setImageList={setImageList} />
  )
}


//root component
const App = () => {
  const [imageList, setImageList] = useState([])
  const [scenes, setScenes] = useState([]) //list of all the scenes
  const [loadedScene, setLoadedScene] = useState(null) //currently selected scene to display

  const entryKey = useSelector(i => i.user.entryToken)
  const lan = useSelector(i => i.view.lan)


  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={
          entryKey
            ? <PostEntry loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} scenes = {scenes} setScenes = {setScenes} imageList={imageList} setImageList={setImageList} />
            : <Entry />
        } />
        <Route path='/view/:fileName' element = {<HighlightView imageList = {imageList} /> }/>
      </Routes>


    </div>

  )

}


export default App;
