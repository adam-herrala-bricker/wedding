import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setScroll } from '../reducers/viewReducer'
import { getText } from '../resources/text'

//component for selecting resolution of images displayed in highlight view (grid view is always web res)
const ClosedView = ({ setSelectOpen}) => {
    return(
        <div className='scene-filter-container'>
            <button onClick = {() => setSelectOpen(true)}>
                {getText('resolution')}
            </button>
        </div>
    )
}

const OpenView = ({ setSelectOpen, res, setRes }) => {
    const dispatch = useDispatch()


    //event handler
    const handleChangeRes = (newRes) => {
        setRes(newRes)
        dispatch(setScroll(window.scrollY))
    }

    return(

        <div className='scene-filter-container'>
            <button onClick = {() => setSelectOpen(false)}>{getText('done')}</button>
            <button onClick = {() => handleChangeRes('web')} className = {res === 'web' ? 'scene-name-highlight' : 'scene-name-regular'}>
                {getText('faster')}
            </button>
            <button onClick = {() => handleChangeRes('high')} className = {res === 'high' ? 'scene-name-highlight' : 'scene-name-regular'}>
                {getText('larger')}
            </button>
        </div>
    )
}

const ResSelect = ({ res, setRes }) => {
    const [selectOpen, setSelectOpen] = useState(false)
    
    return(
        selectOpen
            ? <OpenView setSelectOpen = {setSelectOpen} res = {res} setRes = {setRes}/>
            : <ClosedView setSelectOpen = {setSelectOpen}/>
    )
}

export default ResSelect