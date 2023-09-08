import { useState, useEffect } from 'react'
import audioServices from '../services/audioServices'
import adminServices from '../services/adminServices'
import text from '../resources/text'
import helpers from '../utilities/helpers'
//import testAudio from '../resources/test36.1c.wav'

const DeleteSong = ({ songID, setMusic }) => {
    //event handler
    const handleDelete = async () => {
        if (window.confirm('comfirm delete')) {
            await adminServices.deleteAudio(songID)

            //reload and reset songs
            const audioData = await audioServices.getAudioData()
            setMusic(audioData)
        }
    }

    return (
        <div>
            <button onClick={handleDelete}>-</button>
        </div>
    )
}

const Music = ({ lan, user, music, setMusic }) => {
    //note: fileToName lives in utilities/helpers now

    //effect hook to load music metadata from DB
    useEffect(() => {
        const fetchData = async () => {
            const audioData = await audioServices.getAudioData()
            audioData.sort(helpers.compareSongs)
            setMusic(audioData)
        }

        fetchData()

    }, [])

    return (
        <div className='music-div'>
            <h2 className='new-section'>
                {text.music[lan]}
            </h2>
            {music.map(i =>
                <div className='music-container' key={i.id}>
                    <audio controls src={`/api/audio/${i.fileName}`} />
                    <h2>{helpers.fileToName(i) ? text[helpers.fileToName(i)][lan] : 'song title missing'}</h2>
                    {user.isAdmin && <DeleteSong songID={i.id} setMusic={setMusic} />}
                </div>
            )}
        </div>
    )
}

export default Music