import { useState, useEffect } from 'react'
import sceneServices from '../services/sceneServices'
import text from '../resources/text'

const InactiveView = ({setIsActive, lan}) => {
    return(
        <button onClick = {() => setIsActive(true)}>{text.filter[lan]}</button>
    )
}

const CurrentScenes = ({scenes, setImageList, lan}) => {
    //event handler
    const handleSceneChange = (sceneID) => {
        setImageList(scenes.filter(i => i.id == sceneID)[0].images)
    }

    return(
        scenes.map(i => 
            <button key = {i.id} onClick = {() => {handleSceneChange(i.id)}}>
                {text[i.sceneName.replace('-','')] ? text[i.sceneName.replace('-','')][lan] : i.sceneName}
            </button>
            )
    )
}

const DeleteScenes = ({scenes, setScenes}) => {
    //event handler
    const deleteScene = async (scene) => {
        if (window.confirm(`Are you sure you want to delete scene ${scene.sceneName}?`)) {
            await sceneServices.deleteScene(scene)

            const newScenes = scenes.filter(i => i.id !== scene.id)
            setScenes(newScenes) // WATCH OUT TO SEE IF WE NEED TO ADD SORTING HERE!!

        }
    }

    return(
            scenes.map(i => 
            <button key = {i.id} onClick = {() => deleteScene(i)}>
                -
            </button>)
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

const ActiveView = ({setIsActive, scenes, setScene, setScenes, setImageList, user, lan}) => {
    return(
        <div>
            <button onClick = {() => setIsActive(false)}>{text.done[lan]}</button>
            <CurrentScenes scenes = {scenes} setScene = {setScene} setImageList = {setImageList} lan = {lan}/>
            <div>
                {user.isAdmin && <DeleteScenes scenes = {scenes} setScenes = {setScenes}/>}
            </div>
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