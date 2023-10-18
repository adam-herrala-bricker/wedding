import { useDispatch, useSelector } from 'react-redux'
import { deleteSong } from '../reducers/mediaReducer'
import { getText } from '../resources/text'
import helpers from '../utilities/helpers'
//import testAudio from '../resources/test36.1c.wav'

const DeleteSong = ({ songID }) => {
    const dispatch = useDispatch()
    //event handler
    const handleDelete = async () => {
        if (window.confirm('comfirm delete')) {
            dispatch(deleteSong(songID))
        }
    }

    return (
        <div>
            <button onClick={handleDelete}>-</button>
        </div>
    )
}

const Music = () => {
    const user = useSelector(i => i.user)
    const music = useSelector(i => i.media.music)

    return (
        <div className='music-div'>
            <h2 className='new-section'>
                {getText('music')}
            </h2>
            {music.map(i =>
                <div className='music-container' key={i.id}>
                    <audio controls src={`/api/audio/${i.fileName}`} />
                    <h2>{helpers.fileToName(i) ? getText(helpers.fileToName(i)) : 'song title missing'}</h2>
                    {user.adminToken && <DeleteSong songID={i.id} />}
                </div>
            )}
        </div>
    )
}

export default Music