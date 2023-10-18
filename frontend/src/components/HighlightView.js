import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, CloseButton, Image} from 'react-bootstrap'
import { getText } from '../resources/text'

//component for highlighting a single image
const HighlightView = () => {
    const [thisClass, setThisClass] = useState('single-image-hidden')
    const res = useSelector(i => i.view.res)
    const imageList = useSelector(i => i.media.images.display)

    const navigate = useNavigate()
    const thisFile = useParams().fileName

    //helper function to get adjoining index in imageList
    const adjoiningImage = (direction) => {
      const thisIndex = imageList.map(i => i.fileName).indexOf(thisFile)
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
  
    //event handlers
    const handleBack = () => {
      navigate('/')
    }

    const handleScrollClick = (direction) => {
        //uses same direction encoding as the arrow handler since it shares a helper function
        const nextFile = imageList[adjoiningImage(direction)].fileName
        navigate(`/view/${nextFile}`)
    }

    //also an event handler??
    const handleArrow = (event) => {
        const nextFile = imageList[adjoiningImage(event.key)].fileName
        navigate(`/view/${nextFile}`)
    }

    const handleLoad = () => {
      setThisClass('highlight-image')
    }
  
    //effect hook for listening to keyboard
    //NOTE THAT IT ABSOLUTELY HAS TO BE HERE!! NOT LOOSE IN THE COMPONENT
    useEffect(() => {
      console.log('listener added')
      window.addEventListener('keydown', handleArrow)
      return () => {
        window.removeEventListener('keydown', handleArrow)
      }
    }, [thisFile])
    
    //this has to live down here for some reason
    const baseURL = res === 'high'
      ? '/api/images' 
      : '/api/images/web-res'
    
    const imagePath = `${baseURL}/${thisFile}`

    return(
      <div className = 'outer-highlight-container'>
        <div>
          <CloseButton onClick = {handleBack}/>
        </div>
        <div className = 'highlight-group'>
          <Image alt = '' src = {imagePath} className = {thisClass} onLoad = {handleLoad}/>
        </div>
        <div className = 'highlight-group'>
          {thisClass === 'single-image-hidden' && getText('loading') + '...'}
        </div>
        {thisClass !== 'single-image-hidden' &&
          <div className = 'bs-button-container'>
            <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowLeft')}>{'<--'}</Button>
            <a download className = 'regular-text' href = {imagePath}><Button variant = 'outline-dark'>{getText('download')}</Button></a>
            <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowRight')}>{'-->'}</Button>
          </div>
        }
      </div>
    )
  
  }

export default HighlightView