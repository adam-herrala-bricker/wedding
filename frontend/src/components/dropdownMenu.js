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
        const temp = scenes.filter(i => i.id == sceneID)[0].images
        console.log(temp)
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

const CreateNewScene = ({scenes, setScenes}) => {
    const [toggleView, setToggleView] = useState(true) //deal w toggling later
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