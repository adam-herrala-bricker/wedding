import { useDispatch } from 'react-redux'
import { setScroll } from '../reducers/viewReducer'

import usFlag from '../resources/us-flag.png'
import finFlag from '../resources/fin-flag.png'

const Language = ({setLan}) => {
    const dispatch = useDispatch()

    const handleLanChange = (newLan) => {
        dispatch(setScroll(window.scrollY))
        setLan(newLan)
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