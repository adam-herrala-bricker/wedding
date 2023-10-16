import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScroll } from '../reducers/viewReducer'
import sceneServices from '../services/sceneServices'
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

const CurrentScenes = ({loadedScene, setLoadedScene, scenes, setScenes, setImageList }) => {
    const dispatch = useDispatch()
    const user = useSelector(i => i.user)

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
        setLoadedScene(sceneName)
        dispatch(setScroll(window.scrollY))
    }

    const deleteScene = async (scene) => {
        if (window.confirm(`Are you sure you want to delete scene ${scene.sceneName}?`)) {
            await sceneServices.deleteScene(scene)

            const newScenes = scenes.filter(i => i.id !== scene.id)
            setScenes(newScenes) // WATCH OUT TO SEE IF WE NEED TO ADD SORTING HERE!!

        }
    }

    return(
        scenes.map(i => 
            <div key = {i.id}>
                <button key = {`${i.id}-fil`} className = {i.sceneName === loadedScene ? 'scene-name-highlight' : 'scene-name-regular'} onClick = {() => {handleSceneChange(i)}}>
                    {getText(i.sceneName.replace('-','')) || i.sceneName}
                </button>
                {user.adminToken &&
                <button key = {`${i.id}-del`} onClick = {() => deleteScene(i)}>
                    -
                </button>
                }
            </div>
            
            )
    )
}

const CreateNewScene = ({scenes, setScenes }) => {
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

        const addedScene = await sceneServices.addScene({sceneName : newSceneName()})

        setScenes(scenes.concat(addedScene))

    }

    return(<button onClick = {handleCreateNew}>{getText('new')}</button>)

}

const ActiveView = ({loadedScene, setLoadedScene, setIsActive, scenes, setScenes, setImageList }) => {
    const user = useSelector(i => i.user)

    return(
        <div id = 'scenes' className = 'scene-filter-container'>
            <button onClick = {() => setIsActive(false)}>{getText('done')}</button>
            <CurrentScenes loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} />
            {user.adminToken && <CreateNewScene scenes = {scenes} setScenes = {setScenes} />}
        </div>
    )
}

const DropDown = ({loadedScene, setLoadedScene, scenes, setScenes, setImageList }) => {
    const [isActive, setIsActive] = useState(false)

    return(
        <div>
            {isActive
            ? <ActiveView loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} setIsActive = {setIsActive} scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} />
            : <InactiveView setIsActive = {setIsActive} />
        }
        </div>
    )
}

export default DropDown