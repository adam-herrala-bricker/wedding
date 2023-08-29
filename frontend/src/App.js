import { useState, useEffect} from 'react'
import text from './resources/text.js'
import ImageUpload from './components/ImageUpload'
import User from './components/User'
import Music from './components/Music'
import Images from './components/Images'
import Entry from './components/Entry'
import Language from './components/Language'
import imageServices from './services/imageServices'

//component for highlighting a single image
//NOTE: may want to eventually move to own module to add under-image features
const HighlightView = ({highlight, setHighlight, lan}) => {
  //event handler
  const handleBack = () => {
    setHighlight({current : null, outgoing : highlight.current})
  }

  const baseURL = '/api/images'
  return(
    <div className = 'highlight-background'>
      <button onClick = {handleBack}>{text.back[lan]}</button>
      <img className = 'highlight-image' alt = '' src = {`${baseURL}/${highlight.current.fileName}`}/>
    </div>
  )

}

//component for regular view
const RegularView = ({highlight, setHighlight, setEntryKey, lan, setLan}) => {
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
        <h1>{text.header[lan]}</h1>
        <h2><a href = '#music' className = 'header-link'>{text.music[lan]}</a></h2>
        <h2><a href = '#images' className = 'header-link'>{text.photos[lan]}</a></h2>
        <Language setLan = {setLan}/>
        <User user = {user} setUser = {setUser} guestUser = {guestUser} setEntryKey = {setEntryKey} lan = {lan}/>
      </div>
      {user.isAdmin && <ImageUpload setImageList = {setImageList}/>}
      <section id = 'music'>
        <Music  lan = {lan} />
      </section>
      
      <Images id = 'images' imageList={imageList} setImageList = {setImageList} user = {user} setHighlight = {setHighlight} lan = {lan}/>
      
      
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
  const [highlight, setHighlight] = useState({current : null, outgoing : null})
  const [entryKey, setEntryKey] = useState(null)
  const [lan, setLan] = useState('suo')

  //effect hook for scolling back to the right part of the page
  useEffect(() => {
    if (highlight.outgoing) {
      //my cheating way of avoiding the issue with calling the element before it's rendered
      setTimeout(() => {
        const elementID = highlight.outgoing.id
        const element = document.getElementById(elementID)
        element.scrollIntoView({behavior : 'smooth'})
      }, 100)
      
    }
  }, [highlight])


  return(
    <>
      {entryKey
        ? highlight.current === null
          ? <RegularView highlight = {highlight} setHighlight = {setHighlight} setEntryKey = {setEntryKey} lan = {lan} setLan = {setLan}/>
          : <HighlightView highlight = {highlight} setHighlight = {setHighlight} lan = {lan}/>
        : <Entry setEntryKey = {setEntryKey}/>
      }
      
    </>

  )

}


export default App;
