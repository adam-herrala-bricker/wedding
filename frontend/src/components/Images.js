import { useState, useEffect, useRef} from 'react'
import { ProgressBar } from 'react-bootstrap'
import adminServices from '../services/adminServices'
import sceneServices from '../services/sceneServices'
import imageServices from '../services/imageServices'
import text from '../resources/text.js'
import DropDown from './dropdownMenu.js'
import helpers from '../utilities/helpers'

//component for rendering each image
const Image = ({ imagePath }) => {
    const baseURL = '/api/images'
    const [thisClass, setThisClass] = useState('single-image-hidden')

    //event handler
    const handleLoaded = () => {
        setThisClass('single-image')
    }

    return(
        <div className = 'single-image-container'>
            <img className = {thisClass} alt = 'single image' loading = 'eager' src = {`${baseURL}/${imagePath}`} onLoad = {handleLoaded}/>
        </div>
    )
    
    
}

//component for rendering everything below an image
const BelowImage = ({setLastScroll, lan, imageID, imageList, setImageList, user, scenes, setScenes}) => {
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
        if (window.confirm('Are you sure you want to delete?')) {
            //image object that's being deleted
            const contentToDelete = imageList.filter(i => i.id === imageID)[0]

            //then actually delete it from the images DB
            await adminServices.deleteImage(imageID)
            const newFileList = imageList.filter(i => i.id !== imageID)
            
            newFileList.sort(helpers.compareImages)
            setImageList(newFileList)
        }
    }
       
    //handles linking/unlinking scenes to images
    const handleSceneLink = async (scene, imageID) => {
        setLastScroll(window.scrollY) //keep from jumping around afterwards

        //single object with value = array of list of IDs!
        const updatedIDs = isLinked(scene, imageID)
            ? [...scene.images.filter(i => i.id !== imageID).map(i => i.id)]
            : [...scene.images.map(i => i.id), imageID]

        const updatedScene = await sceneServices.updateScene({id: scene.id, imageIDs : updatedIDs})
        const thisScene = updatedScene.sceneName
        
        //const newScenes = await sceneServices.getScenes() //too much lag this way
        const newScenes = [...scenes.filter(i => i.sceneName !== thisScene), updatedScene]

        newScenes.sort(helpers.compareScenes)

        setScenes(newScenes)

        //update image DB too (also needs object in same format as scene)
        const thisImage = imageList.filter(i => i.id === imageID)[0]
        thisImage.scenes = isLinked(scene, imageID)
            ? thisImage.scenes.map(i => i.id).filter(i => i !== scene.id)
            : thisImage.scenes.map(i => i.id).concat(scene.id)
        
        const returnedImage = await imageServices.updateImageData({id: imageID, scenes : thisImage.scenes})

        const newImageList = [...imageList.filter(i => i.id !==imageID), returnedImage]

        newImageList.sort(helpers.compareImages)
        setImageList(newImageList)
        
    }

    return(
        <div className='under-image-container'>
            <button onClick = {() => handleDelete(imageID)}>-</button>
            {scenes.map(i => 
                <button className = {isLinked(i, imageID)
                    ? 'scene-linked'
                    : 'scene-unlinked'
                }
                key = {i.id} onClick = {() => handleSceneLink(i, imageID)}>
                    {text[i.sceneName.replace('-','')] ? text[i.sceneName.replace('-','')][lan] : i.sceneName}
                </button>
                )
            }
        </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({lastScroll, setLastScroll, lan, imageList, setImageList, highlight, setHighlight, user, scenes, setScenes}) => {
    const [groupClass, setGroupClass] = useState('group-hidden')
    const [loadProgress, setLoadProgress] = useState(0) //how many images have loaded 
    const progressRef = useRef(0)

    //const minLoadNumber = 10 //minimum number of loaded images to display

    
    //event handlers
    const handleSetHighlight = (i) => {
        setLastScroll(window.scrollY)
        setHighlight({current : i, outgoing: null})
    }

    //Note: this seems to trigger on every load in the children elements, not when they're all loaded
    const handleNewLoad = () => {
        setLastScroll(window.scrollY)
        console.log('loaded!')
        progressRef.current ++ //doing this as a ref decouples it from rendering, lets it update multiple times per render
        console.log(progressRef.current)
        //const newProgress = loadProgress +1 
        setLoadProgress(progressRef.current)

        progressRef.current === imageList.length && setGroupClass('image-grouping')
    }

    //note the scroll just goes here
    window.scroll({left: 0, top: lastScroll, behavior: 'instant'})
    
    return(
        <div>
            <div>loading {loadProgress} of {imageList.length}</div>
            {groupClass === 'group-hidden' && <ProgressBar now = {loadProgress} max = {imageList.length} style = {{maxWidth : 500}} />}
            <div className = {groupClass} onLoad = {handleNewLoad}>
                {imageList.map(i =>
                    <div id = {i.id} key = {i.id}>
                        <button className = {i.scenes.map(i => i.sceneName).includes('scene-0') ? 'image-button' : 'hidden-image'}
                                onClick = {() => handleSetHighlight(i)}>
                            <Image key = {`${i.id}-img`} imagePath={i.fileName} />
                        </button>
                    {user.isAdmin && <BelowImage key = {`${i.id}-bel`} setLastScroll = {setLastScroll} lan = {lan} imageID = {i.id} imageList = {imageList} setImageList = {setImageList} user = {user} scenes = {scenes} setScenes = {setScenes}/>}
                    </div>
                    )}
            </div>
        </div>
    )
}

//root component for this module
const Images = ({loadedScene, setLoadedScene, lastScroll, setLastScroll, scenes, setScenes, imageList, setImageList, user, highlight, setHighlight, lan}) => {
    
    //effect hook to get scenes at first render
    useEffect(() => {
        const fetchData = async () => {
            const scenes = await sceneServices.getScenes()
            scenes.sort(helpers.compareScenes)
            setScenes(scenes)
        }
        fetchData()
    }, [imageList])



    return(
        <div>
            <h2 id = 'image-top' className='new-section'>{text.photos[lan]}</h2>
            <DropDown loadedScene = {loadedScene} setLoadedScene = {setLoadedScene} setLastScroll = {setLastScroll} scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} user = {user} lan = {lan}/>
            <ImageGroup lastScroll = {lastScroll} setLastScroll = {setLastScroll} lan = {lan} imageList = {imageList} setImageList = {setImageList} user = {user} highlight = {highlight} setHighlight = {setHighlight} scenes = {scenes} setScenes = {setScenes}/>
        </div>
    )
}

export default Images