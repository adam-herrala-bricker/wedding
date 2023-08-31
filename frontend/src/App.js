import { useState, useEffect} from 'react'
import text from './resources/text.js'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Music from './components/Music'
import Images from './components/Images'
import Entry from './components/Entry'
import Language from './components/Language'
import imageServices from './services/imageServices'
import helpers from './utilities/helpers'

//component for highlighting a single image
//NOTE: may want to eventually move to own module to add under-image features
const HighlightView = ({imageList, highlight, setHighlight, lan}) => {
  
  //helper function to get adjoining index in imageList
  const adjoiningImage = (highlight, direction) => {
    const thisIndex = imageList.map(i => i.fileName).indexOf(highlight.current.fileName)
    console.log(thisIndex)
    const totalLength = imageList.length

    //only one entry --> return 0 (bugs out otherwise)
    if (totalLength === 1) {
      return 0
    //direction = right (doesn't move if at the end)
    }else if (direction === 'ArrowRight') {
      return thisIndex === totalLength - 1 ? thisIndex : thisIndex + 1
    //direct = left (doesn't move if at beginning)
    } else if (direction === 'ArrowLeft') {
      return thisIndex === 0 ? thisIndex : thisIndex -1
    } else {
      return thisIndex
    }
  }

  //event handler
  const handleBack = () => {
    setHighlight({current : null, outgoing : highlight.current})
    window.removeEventListener('keydown', handleArrow, {once : true})
  }

  //also an event handler??
  const handleArrow = (event) => {
    console.log(event.key)
      console.log(adjoiningImage(highlight, event.key ))
      setHighlight({current : imageList[adjoiningImage(highlight, event.key)], outgoing : null})
  }

  //effect hook for listening to keyboard
  useEffect(() => {
    window.addEventListener('keydown', handleArrow, {once : true})
  }, [highlight])

  console.log(imageList)

  const baseURL = '/api/images' //this has to live down here for some reason
  return(
    <div className = 'highlight-background'>
      <button onClick = {handleBack}>{text.back[lan]}</button>
      <img className = 'highlight-image' alt = '' src = {`${baseURL}/${highlight.current.fileName}`}/>
    </div>
  )

}

//component for regular view
const RegularView = ({guestUser, user, setUser, imageList, setImageList, lastScroll, setLastScroll, highlight, setHighlight, setEntryKey, lan, setLan}) => {
  const [scenes, setScenes] = useState([]) //list of all the scenes


  return(
    <div>
      <div className='flexbox-header'>
        <h1>{text.header[lan]}</h1>
        <h2><a href = '#music' className = 'header-link'>{text.music[lan]}</a></h2>
        <h2><a href = '#image-top' className = 'header-link'>{text.photos[lan]}</a></h2>
        <Language setLan = {setLan}/>
        <User user = {user} setUser = {setUser} guestUser = {guestUser} setEntryKey = {setEntryKey} lan = {lan}/>
      </div>
      {user.isAdmin && <ImageUpload setImageList = {setImageList}/>}
      <section id = 'music'>
        <Music  user = {user} lan = {lan} />
      </section>
      <Images lastScroll = {lastScroll} setLastScroll = {setLastScroll} id = 'images' scenes = {scenes} setScenes = {setScenes} imageList={imageList} setImageList = {setImageList} user = {user} highlight = {highlight} setHighlight = {setHighlight} lan = {lan}/>
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
  const guestUser = {displayname: 'guest', username: 'guest'}
  const [highlight, setHighlight] = useState({current : null, outgoing : null})
  const [entryKey, setEntryKey] = useState(null)
  const [lan, setLan] = useState('suo')
  const [lastScroll, setLastScroll] = useState(0)//for scrolling to same part of page after highlight
  const [imageList, setImageList] = useState([])
  const [user, setUser] = useState(guestUser)

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
    <>
      {entryKey
        ? highlight.current === null
          ? <RegularView guestUser = {guestUser} user = {user} setUser = {setUser} imageList = {imageList} setImageList = {setImageList} lastScroll = {lastScroll} setLastScroll = {setLastScroll} highlight = {highlight} setHighlight = {setHighlight} setEntryKey = {setEntryKey} lan = {lan} setLan = {setLan}/>
          : <HighlightView imageList = {imageList} highlight = {highlight} setHighlight = {setHighlight} lan = {lan}/>
        : <Entry setEntryKey = {setEntryKey}/>
      }
      
    </>

  )

}


export default App;
