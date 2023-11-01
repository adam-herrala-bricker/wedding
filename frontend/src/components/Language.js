import { useDispatch, useSelector } from 'react-redux'
import { setLan, setScroll } from '../reducers/viewReducer'

import usFlag from '../resources/us-flag.png'
import finFlag from '../resources/fin-flag.png'

const Language = () => {
    const dispatch = useDispatch()
    const lan = useSelector(i => i.view.lan)

    const handleLanChange = (newLan) => {
        dispatch(setScroll(window.scrollY))
        dispatch(setLan(newLan))
    }


    return(
        <div className='language-container'>
            <button className = 'flag-button' onClick = {() => handleLanChange('suo')}>
                <img className = 'flag-icon' alt = 'suomeksi' src = {finFlag}/>
            </button>
            <button className = 'flag-button' onClick = {() => handleLanChange('eng')}>
                <img className = 'flag-icon' alt = 'English' src = {usFlag}/>
            </button>
        </div>
    )
}

export default Language