import {useState, useEffect} from 'react'
import audioServices from '../services/audioServices'
import adminServices from '../services/adminServices'
import text from '../resources/text'
//import testAudio from '../resources/test36.1c.wav'

const DeleteSong = ({songID, setMusic}) => {
    //event handler
    const handleDelete = async () => {
        console.log(songID)
        await adminServices.deleteAudio(songID)

        //reload and reset songs
        const audioData = await audioServices.getAudioData()
        setMusic(audioData)

    }

    return(
        <div>
            <button onClick = {handleDelete}>-</button>
        </div>
    )
}

const Music = ({lan, user}) => {
    const fileToName = {'waiting.mp3' : 'song0', 'transition.mp3' : 'song1', 'down-the-aisle.mp3' : 'song2', 'Mia2.1.mp3' : 'song3'} //to get the right song names for the right files
    const [music, setMusic] = useState([])

    //effect hook to load music metadata from DB
    useEffect(() => {
        const fetchData = async () => {
            const audioData = await audioServices.getAudioData()
            setMusic(audioData)
        }

        fetchData()

    },[])

    return(
        <div>
            <h2>
                {text.music[lan]}
            </h2>
            {music.map(i => 
                <div className = 'music-container' key = {i.id}>
                    <audio controls src = {`/api/audio/${i.fileName}`}/>
                    <h2>{fileToName[i.fileName] ? text[fileToName[i.fileName]][lan] : 'song title missing'}</h2>
                    
                    {user.isAdmin && <DeleteSong songID = {i.id} setMusic = {setMusic}/>}
                </div>
                )}  
        </div>
    )
}

export default Music