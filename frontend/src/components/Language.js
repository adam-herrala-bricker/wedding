import usFlag from '../resources/us-flag.png'
import finFlag from '../resources/fin-flag.png'

const Language = ({setLan}) => {

    return(
        <div className='language-container'>
            <button className = 'flag-button' onClick = {() => setLan('suo')}>
                <img className = 'flag-icon' alt = 'suomeksi' src = {finFlag}/>
            </button>
            <button className = 'flag-button' onClick = {() => setLan('eng')}>
                <img className = 'flag-icon' alt = 'English' src = {usFlag}/>
            </button>
        </div>
    )
}

export default Language