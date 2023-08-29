import {useState, useEffect} from 'react'
import audioServices from '../services/audioServices'
import text from '../resources/text'
//import testAudio from '../resources/test36.1c.wav'

const Music = ({lan}) => {
    const [music, setMusic] = useState([])

    //effect hook to load music metadata from DB
    useEffect(() => {
        const fetchData = async () => {
            const audioData = await audioServices.getAudioData()
            setMusic(audioData)
        }

        fetchData()
    },[])

    console.log(music)

    return(
        <div>
            <h2>
                {text.music[lan]}
            </h2>
            {music.map(i => 
                <div>
                    <audio controls src = {`/api/audio/${i.fileName}`}/>
                </div>
                )}  
        </div>
    )
}

export default Music