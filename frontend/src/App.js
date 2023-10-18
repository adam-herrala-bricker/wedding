import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getText } from './resources/text.js'
import { initializeScenes } from './reducers/sceneReducer.js'
import { initializeImages } from './reducers/mediaReducer.js'
import { initializeMusic } from './reducers/mediaReducer.js'
import ImageUpload from './components/ImageUpload'
import Music from './components/Music'
import Images from './components/Images'
import Entry from './components/Entry'
import CustomNavbar from './components/CustomnNavbar.js'
import Language from './components/Language'
import HighlightView from './components/HighlightView.js'

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
const RegularView = () => {
  const user = useSelector(i => i.user)

  const lastScroll = useSelector(i => i.view.scroll)

  //note the scroll just goes here (temp fix on timing)
  setTimeout(() => {
    window.scroll({ left: 0, top: lastScroll, behavior: 'instant' })
  },50)
  
  
  return (
    <div>
      <DisplayUser />
      <CustomNavbar ></CustomNavbar>
      {user.adminToken && <ImageUpload />}
      <section id='headingsSection'>
        <div>
          <h1>{getText('welcomeTxt')}</h1>
        </div>
        <h2>{getText('welcomeSubTxt')}</h2>
      </section>
      <section id='music'>
        <Music />
      </section>
      <Images id='images' />
    </div>
  )
}

//root component
const App = () => {
  const dispatch = useDispatch()
  //note that if you do this as an object (i.e. 'user') it will update everytime
  //since equality comparison is === by default (may be able to fix with custom equality comparison?)
  const entryToken = useSelector(i => i.user.entryToken)
  const adminToken = useSelector(i => i.user.adminToken)

  //initialize states
  useEffect(() => {
    dispatch(initializeScenes(entryToken))
    dispatch(initializeImages(entryToken, adminToken))
    dispatch(initializeMusic(entryToken))
  }, [entryToken, adminToken])
  

  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={
          entryToken
            ? <RegularView />
            : <Entry />
        } />
        <Route path='/view/:fileName' element = {<HighlightView /> }/>
      </Routes>
    </div>
  )
}

export default App;
