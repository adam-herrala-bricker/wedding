import { useState } from 'react'
import text from '../resources/text'

//component for selecting resolution of images displayed in highlight view (grid view is always web res)
const ClosedView = ({ lan, setSelectOpen}) => {
    return(
        <div className='scene-filter-container'>
            <button onClick = {() => setSelectOpen(true)}>
                {text.resolution[lan]}
            </button>
        </div>
    )
}

const OpenView = ({ lan, setSelectOpen, res, setRes, setLastScroll }) => {

    //event handler
    const handleChangeRes = (newRes) => {
        setRes(newRes)
        setLastScroll(window.scrollY)
    }

    return(

        <div className='scene-filter-container'>
            <button onClick = {() => setSelectOpen(false)}>{text.done[lan]}</button>
            <button onClick = {() => handleChangeRes('web')} className = {res === 'web' ? 'scene-name-highlight' : 'scene-name-regular'}>
                {text.faster[lan]}
            </button>
            <button onClick = {() => handleChangeRes('high')} className = {res === 'high' ? 'scene-name-highlight' : 'scene-name-regular'}>
                {text.larger[lan]}
            </button>
        </div>



    )
}



const ResSelect = ({lan, res, setRes, setLastScroll}) => {
    const [selectOpen, setSelectOpen] = useState(false)
    
    return(
        selectOpen
            ? <OpenView lan = {lan} setSelectOpen = {setSelectOpen} res = {res} setRes = {setRes} setLastScroll={setLastScroll}/>
            : <ClosedView lan = {lan} setSelectOpen = {setSelectOpen}/>
        
    )
}

export default ResSelect