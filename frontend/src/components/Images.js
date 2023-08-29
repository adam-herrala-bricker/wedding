import { useState, useEffect } from 'react'
import adminServices from '../services/adminServices'
import sceneServices from '../services/sceneServices'
import text from '../resources/text.js'
import DropDown from './dropdownMenu.js'

//component for rendering each image
const Image = ({imagePath}) => {
    const baseURL = '/api/images'

    return(
        <div>
            <img className = 'single-image' alt = '' src = {`${baseURL}/${imagePath}`}/> 
        </div>
    )
}

//component for rendering everything below an image
const BelowImage = ({imageID, imageList, setImageList, user, scenes, setScenes}) => {
    //helper function for testing whether the image is aleady linked to a scene
    const isLinked = (scene, imageID) => {
        if (scene.images.map(i => i.id).includes(imageID)) {
            return true
        } else {
            return false
        }
    }
    
    //event handlers
    const handleDelete = async (imageID) => {
        await adminServices.deleteImage(imageID)
        const newFileList = imageList.filter(i => i.id !== imageID)
        setImageList(newFileList)
    }

    //handles linking/unlinking scenes to images
    const handleSceneLink = async (scene, imageID) => {
        //single object with value = array of list of IDs!
        const updatedIDs = isLinked(scene, imageID)
            ? [...scene.images.filter(i => i.id !== imageID).map(i => i.id)]
            : [...scene.images.map(i => i.id), imageID]

        const updatedScene = await sceneServices.updateScene({id: scene.id, imageIDs : updatedIDs})
        const thisScene = updatedScene.sceneName
        
        //const newScenes = await sceneServices.getScenes() //too much lag this way
        const newScenes = [...scenes.filter(i => i.sceneName !== thisScene), updatedScene]

        setScenes(newScenes)
        
    }

    return(
        <div>
            <button onClick = {() => handleDelete(imageID)}>delete</button>
            {scenes.map(i => 
                <button className = {isLinked(i, imageID)
                    ? 'scene-linked'
                    : 'scene-unlinked'
                }
                key = {i.id} onClick = {() => handleSceneLink(i, imageID)}>
                    {i.sceneName}
                </button>
                )
            }
        </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({imageList, setImageList, setHighlight, user, scenes, setScenes}) => {
    return(
        <div className = 'image-grouping'>
            {imageList.map(i =>
                <div key = {i.id}>
                    <button className = 'image-button' onClick = {() => setHighlight(i)}>
                        <Image key = {`${i.id}-img`} imagePath={i.fileName} />
                    </button>
                   {user.isAdmin && <BelowImage key = {`${i.id}-bel`} imageID = {i.id} imageList = {imageList} setImageList = {setImageList} user = {user} scenes = {scenes} setScenes = {setScenes}/>}
                </div>
                )}
        </div>
    )
}

//root component for this module
const Images = ({imageList, setImageList, user, setHighlight, lan}) => {
    const [scenes, setScenes] = useState([]) //list of all the scenes

    //effect hook to get scenes at first render
    useEffect(() => {
        const fetchData = async () => {
            const scenes = await sceneServices.getScenes()
            setScenes(scenes)
        }
        fetchData()
    }, [imageList])

    console.log(scenes)



    return(
        <div>
            <h2>{text.photos[lan]}</h2>
            <DropDown scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} user = {user}/>
            <ImageGroup imageList = {imageList} setImageList = {setImageList} user = {user} setHighlight = {setHighlight} scenes = {scenes} setScenes = {setScenes}/>
        </div>
    )
}

export default Images