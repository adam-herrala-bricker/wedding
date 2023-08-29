import { useState, useEffect } from 'react'
import sceneServices from '../services/sceneServices'

const InactiveView = ({setIsActive}) => {
    return(
        <button onClick = {() => setIsActive(true)}>filter</button>
    )
}

const CurrentScenes = ({scenes, setImageList}) => {
    //event handler
    const handleSceneChange = (sceneID) => {
        setImageList(scenes.filter(i => i.id == sceneID)[0].images)
    }

    return(
        scenes.map(i => 
            <button key = {i.id} onClick = {() => {handleSceneChange(i.id)}}>
                {i.sceneName}
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
                delete
            </button>)
    )
}

const CreateNewScene = ({scenes, setScenes}) => {
    const [newScene, setNewScene] = useState('')
    //event handlers
    const handleNewSceneChange = (event) => {
        setNewScene(event.target.value)
    }

    const handleCreateNew = async (event) => {
        event.preventDefault()

        const addedScene = await sceneServices.addScene({sceneName : newScene})

        setScenes(scenes.concat(addedScene))

        setNewScene('')


    }

    return(
       
            <form onSubmit = {handleCreateNew}>
                <input value = {newScene} onChange = {handleNewSceneChange}/>
                <button type = 'submit'>create</button>
            </form>
 
    )

}

const ActiveView = ({setIsActive, scenes, setScene, setScenes, setImageList, user}) => {
    return(
        <div>
            <button onClick = {() => setIsActive(false)}>done</button>
            <CurrentScenes scenes = {scenes} setScene = {setScene} setImageList = {setImageList}/>
            <div>
                {user.isAdmin && <DeleteScenes scenes = {scenes} setScenes = {setScenes}/>}
            </div>
            {user.isAdmin && <CreateNewScene scenes = {scenes} setScenes = {setScenes}/>}
        </div>
    )
}

const DropDown = ({scenes, setScenes, setImageList, user}) => {
    const [isActive, setIsActive] = useState(false)
    

    return(
        <div>
            {isActive
            ? <ActiveView setIsActive = {setIsActive} scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} user = {user}/>
            : <InactiveView setIsActive = {setIsActive}/>
        }
        </div>
    )
}

export default DropDown