import { useState, useEffect } from 'react'
import { Button, CloseButton, Image} from 'react-bootstrap'
import text from '../resources/text'

//component for highlighting a single image
const HighlightView = ({res, imageList, highlight, setHighlight, lan}) => {
  const [thisClass, setThisClass] = useState('single-image-hidden')
  
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
  
    //event handlers
    const handleBack = () => {
      window.removeEventListener('keydown', handleArrow, {once : true})
      setHighlight({current : null, outgoing : highlight.current})
      
    }

    const handleScrollClick = (direction) => {
        //uses same direction encoding as the arrow handler since it shares a helper function
        window.removeEventListener('keydown', handleArrow, {once : true})
        setHighlight({current : imageList[adjoiningImage(highlight, direction)], outgoing : null})
    }

    //also an event handler??
    const handleArrow = (event) => {
        //console.log(event.key)
        //console.log(adjoiningImage(highlight, event.key ))
        setHighlight({current : imageList[adjoiningImage(highlight, event.key)], outgoing : null})
    }

    const handleLoad = () => {
      setThisClass('highlight-image')
    }
  
    //effect hook for listening to keyboard
    useEffect(() => {
      window.addEventListener('keydown', handleArrow, {once : true})
    }, [highlight])
  
    console.log(imageList)
    
    //this has to live down here for some reason
    const baseURL = res === 'high'
      ? '/api/images' 
      : '/api/images/web-res'
    
    const imagePath = `${baseURL}/${highlight.current.fileName}`

    return(
      <div className = 'outer-highlight-container'>
        <div>
          <CloseButton onClick = {handleBack}/>
        </div>
        <div className = 'highlight-group'>
          <Image alt = '' src = {imagePath} className = {thisClass} onLoad = {handleLoad}/>
        </div>
        <div className = 'highlight-group'>
          {thisClass === 'single-image-hidden' && text.loading[lan] + '...'}
        </div>
        {thisClass !== 'single-image-hidden' &&
          <div className = 'bs-button-container'>
            <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowLeft')}>{'<--'}</Button>
            <a download className = 'regular-text' href = {imagePath}><Button variant = 'outline-dark'>{text.download[lan]}</Button></a>
            <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowRight')}>{'-->'}</Button>
          </div>
        }
        
      </div>
    )
  
  }

export default HighlightView