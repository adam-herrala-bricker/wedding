import { useEffect } from 'react'
import { Button, CloseButton, Image} from 'react-bootstrap'
import text from '../resources/text'

//component for highlighting a single image
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
  
    //event handlers
    const handleBack = () => {
      setHighlight({current : null, outgoing : highlight.current})
      window.removeEventListener('keydown', handleArrow, {once : true})
    }

    const handleScrollClick = (direction) => {
        //uses same direction encoding as the arrow handler since it shares a helper function
        setHighlight({current : imageList[adjoiningImage(highlight, direction)], outgoing : null})
    }

    //also an event handler??
    const handleArrow = (event) => {
        //console.log(event.key)
        //console.log(adjoiningImage(highlight, event.key ))
        setHighlight({current : imageList[adjoiningImage(highlight, event.key)], outgoing : null})
    }
  
    //effect hook for listening to keyboard
    useEffect(() => {
      window.addEventListener('keydown', handleArrow, {once : true})
    }, [highlight])
  
    console.log(imageList)
  
    const baseURL = '/api/images' //this has to live down here for some reason
    const imagePath = `${baseURL}/${highlight.current.fileName}`

    return(
      <div className = 'outer-highlight-container'>
        <div>
          <CloseButton onClick = {handleBack}/>
        </div>
        <div className = 'highlight-group'>
          <Image alt = '' src = {imagePath} className = 'highlight-image'/>
        </div>
        <div className = 'bs-button-container'>
          <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowLeft')}>{'<--'}</Button>
          <Button variant = 'outline-dark'><a download className = 'regular-text' href = {imagePath}>download</a></Button>
          <Button variant = 'outline-dark' onClick = {() => handleScrollClick('ArrowRight')}>{'-->'}</Button>
        </div>
      </div>
    )
  
  }

export default HighlightView