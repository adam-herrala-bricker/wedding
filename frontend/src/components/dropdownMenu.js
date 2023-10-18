import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScroll } from '../reducers/viewReducer'
import { createNewScene, deleteScene, setLoaded } from '../reducers/sceneReducer'
import imageServices from '../services/imageServices'
import { getText } from '../resources/text'
import helpers from '../utilities/helpers'

const InactiveView = ({ setIsActive }) => {
    return(
        <div className = 'scene-filter-container'>
            <button onClick = {() => setIsActive(true)}>{getText('filter')}</button>
        </div>
        
    )
}

const CurrentScenes = ({ setImageList }) => {
    const dispatch = useDispatch()
    const user = useSelector(i => i.user)
    const scenes = useSelector(i => i.scenes.list)
    const loadedScene = useSelector(i => i.scenes.loaded)

    //event handlers
    const handleSceneChange = async (scene) => {
        const sceneID = scene.id
        const sceneName = scene.sceneName
        //may be overkill to fetch every time, but easiest sol'n I could think of
        const allImages = await imageServices.getImageData()
        //for admin user, 'all/kaikki' --> everything, even hidden images with no tags
        const filteredImages = (user.adminToken && scenes.filter(i => i.id === sceneID)[0]['sceneName'] === 'scene-0')
         ? allImages
         : allImages.filter(i => (Object.values(i.scenes).map(i => i.id).includes(sceneID) & Object.values(i.scenes).map(i => i.sceneName).includes('scene-0'))) //'all/kakki' tag is required for visibilty on non-admin view
        
        filteredImages.sort(helpers.compareImages)
        setImageList(filteredImages)
        dispatch(setLoaded(sceneName))
        dispatch(setScroll(window.scrollY))
    }

    const handleDeleteScene = async (scene) => {
        if (window.confirm(`Are you sure you want to delete scene ${scene.sceneName}?`)) {
            dispatch(deleteScene(scene))
        }
    }

    return(
        scenes.map(i => 
            <div key = {i.id}>
                <button key = {`${i.id}-fil`} className = {i.sceneName === loadedScene ? 'scene-name-highlight' : 'scene-name-regular'} onClick = {() => {handleSceneChange(i)}}>
                    {getText(i.sceneName.replace('-','')) || i.sceneName}
                </button>
                {user.adminToken &&
                <button key = {`${i.id}-del`} onClick = {() => handleDeleteScene(i)}>
                    -
                </button>
                }
            </div>
            
            )
    )
}

const CreateNewScene = () => {
    const dispatch = useDispatch()
    const scenes = useSelector(i => i.scenes.list)

    //helper function for new scene name
    const newSceneName = () => {
        //currently no scenes
        if (scenes.length === 0 ) {
            return 'scene-0'
        }
        //scene with the largest number
        const maxScene = Math.max(...scenes.map(i => Number(i.sceneName.split('-')[1])))

        return(`scene-${maxScene + 1}`)
    }

    //event handler
    const handleCreateNew = async () => {
        dispatch(createNewScene(newSceneName()))
    }

    return(<button onClick = {handleCreateNew}>{getText('new')}</button>)

}

const ActiveView = ({ setIsActive, setImageList }) => {
    const user = useSelector(i => i.user)

    return(
        <div id = 'scenes' className = 'scene-filter-container'>
            <button onClick = {() => setIsActive(false)}>{getText('done')}</button>
            <CurrentScenes setImageList = {setImageList} />
            {user.adminToken && <CreateNewScene />}
        </div>
    )
}

const DropDown = ({ setImageList }) => {
    const [isActive, setIsActive] = useState(false)

    return(
        <div>
            {isActive
            ? <ActiveView setIsActive = {setIsActive} setImageList = {setImageList} />
            : <InactiveView setIsActive = {setIsActive} />
        }
        </div>
    )
}

export default DropDown