import { useState, useEffect } from 'react'
import sceneServices from '../services/sceneServices'
import imageServices from '../services/imageServices'
import text from '../resources/text'

const InactiveView = ({setIsActive, lan}) => {
    return(
        <div className = 'scene-filter-container'>
            <button onClick = {() => setIsActive(true)}>{text.filter[lan]}</button>
        </div>
        
    )
}

const CurrentScenes = ({scenes, setScenes, setImageList, lan, user}) => {
    //event handlers
    const handleSceneChange = async (sceneID) => {
        //may be overkill to fetch every time, but easiest sol'n I could think of
        const allImages = await imageServices.getImageData()
        //for admin user, 'all/kaikki' --> everything, even hidden images with no tags
        const filteredImages = (user.isAdmin && scenes.filter(i => i.id === sceneID)[0]['sceneName'] === 'scene-0')
         ? allImages
         : allImages.filter(i => Object.values(i.scenes).map(i => i.id).includes(sceneID))
        
        setImageList(filteredImages)
       
        //snap back to standard position
        const element = document.getElementById('scenes')
        element.scrollIntoView({behavior: 'smooth'})
        
        
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
                <button key = {`${i.id}-fil`} onClick = {() => {handleSceneChange(i.id)}}>
                    {text[i.sceneName.replace('-','')] ? text[i.sceneName.replace('-','')][lan] : i.sceneName}
                </button>
                {user.isAdmin &&
                <button key = {`${i.id}-del`} onClick = {() => deleteScene(i)}>
                    -
                </button>
                }
            </div>
            
            )
    )
}

const CreateNewScene = ({scenes, setScenes, lan}) => {
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

    return(<button onClick = {handleCreateNew}>{text.new[lan]}</button>)

}

const ActiveView = ({setIsActive, scenes, setScenes, setImageList, user, lan}) => {
    return(
        <div id = 'scenes' className = 'scene-filter-container'>
            <button onClick = {() => setIsActive(false)}>{text.done[lan]}</button>
            {user.isAdmin && <button onClick = {() => setImageList(scenes)}>{text.clear[lan]}</button>}
            <CurrentScenes scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} lan = {lan} user = {user}/>
            {user.isAdmin && <CreateNewScene scenes = {scenes} setScenes = {setScenes} lan = {lan}/>}
        </div>
    )
}

const DropDown = ({scenes, setScenes, setImageList, user, lan}) => {
    const [isActive, setIsActive] = useState(false)
    

    return(
        <div>
            {isActive
            ? <ActiveView setIsActive = {setIsActive} scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} user = {user} lan = {lan}/>
            : <InactiveView setIsActive = {setIsActive} lan = {lan}/>
        }
        </div>
    )
}

export default DropDown