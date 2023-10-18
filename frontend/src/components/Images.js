import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ProgressBar } from 'react-bootstrap'
import { setScroll } from '../reducers/viewReducer'
import { updateScene } from '../reducers/sceneReducer'
import { updateImages, deleteImage } from '../reducers/mediaReducer'
import ResSelect from './ResSelect'
import DropDown from './dropdownMenu.js'

//component for rendering each image
const Image = ({ imagePath }) => {
    //const baseURL = '/api/images' //may eventually want to high res an option
    const webResURL = '/api/images/web-res'
    const [thisClass, setThisClass] = useState('single-image-hidden')

    //event handler
    const handleLoaded = () => {
        setThisClass('single-image')
    }

    return (
        <div className='single-image-container'>
            <img className={thisClass} alt='single image' loading='eager' src={`${webResURL}/${imagePath}`} onLoad={handleLoaded} />
        </div>
    )
}

//component for rendering everything below an image
const BelowImage = ({ imageID }) => {
    const dispatch = useDispatch()
    const scenes = useSelector(i => i.scenes.list)
    const imageList = useSelector(i => i.media.images.display)
    const textLan = useSelector(i => i.view.textLan)

    //helper function for testing whether the image is aleady linked to a scene
    const isLinked = (scene, imageID) => {
        if (imageList.find(i => i.id === imageID).scenes.map(i => i.sceneName).includes(scene.sceneName)) {
            return true
        } else {
            return false
        }
    }

    /*
    const isLinked = (scene, imageID) => {
        if (scene.images.map(i => i.id).includes(imageID)) {
            return true
        } else {
            return false
        }
    }
    */

    //event handlers
    const handleDelete = async (imageID) => {
        if (window.confirm('Are you sure you want to delete?')) {
            dispatch(deleteImage(imageID))
        }
    }

    //handles linking/unlinking scenes to images
    const handleSceneLink = async (scene, imageID) => {
        console.log('imgage list', imageList)
        dispatch(setScroll(window.scrollY)) //keep from jumping around afterwards

        
        //single object with value = array of list of image IDs!
        const updatedIDs = isLinked(scene, imageID)
            ? [...scene.images.filter(i => i.id !== imageID).map(i => i.id)]
            : [...scene.images.map(i => i.id), imageID]

        dispatch(updateScene(scene.id, updatedIDs))

        //update image DB too (also needs object in same format as scene)
        const currentScenes = imageList.find(i => i.id === imageID).scenes

        console.log('linked:', isLinked(scene, imageID))
        const newScenes = isLinked(scene, imageID)
            ? currentScenes.map(i => i.id).filter(i => i !== scene.id)
            : [...currentScenes.map(i => i.id), scene.id]
        
        console.log(newScenes)

        dispatch(updateImages(imageID, newScenes))

    }

    return (
        <div className='under-image-container'>
            <button onClick={() => handleDelete(imageID)}>-</button>
            {scenes.map(i =>
                <button className={isLinked(i, imageID)
                    ? 'scene-linked'
                    : 'scene-unlinked'
                }
                    key={i.id} onClick={() => handleSceneLink(i, imageID)}>
                    {textLan[i.sceneName.replace('-', '')] || i.sceneName}
                </button>
            )}
        </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({ groupClass, setGroupClass }) => {
    const [loadProgress, setLoadProgress] = useState(0) //how many images have loaded 
    const progressRef = useRef(0)
    
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const user = useSelector(i => i.user)
    const imageList = useSelector(i => i.media.images.display)
    const textLan = useSelector(i => i.view.textLan)

    const handleToHighlight = (fileName) => {
        dispatch(setScroll(window.scrollY))
        navigate(`/view/${fileName}`)
    }

    //const minLoadNumber = 10 //minimum number of loaded images to display

    //Note: this seems to trigger on every load in the children elements, not when they're all loaded
    const handleNewLoad = () => {

        //KEEP AN EYE ON THIS. UNCLEAR WHETHER THIS CAN BE REMOVED OR IF THERE'S A BUG THAT ISN'T SHOWING UP ON PRODUCTION
        if (window.scrollY > 30) { //prevent from setting too quickly when coming back from highlight view (tried to approximate the danger zone)
            //dispatch(setScroll(window.scrollY))
        }
        progressRef.current++ //doing this as a ref decouples it from rendering, lets it update multiple times per render
        setLoadProgress(progressRef.current)

        progressRef.current === imageList.length && setGroupClass('image-grouping') //note: changed to show images while they load
    }

    return (
        <div>
            {groupClass === 'group-hidden' && <div>{textLan.loading} {loadProgress}/{imageList.length}</div>}
            {groupClass === 'group-hidden' && <ProgressBar now={loadProgress} max={imageList.length} style={{ maxWidth: 500 }} />}
            <div className = 'image-grouping' onLoad={handleNewLoad}>
                {imageList.map(i =>
                    <div id={i.id} key={i.id}>
                        <button className={i.scenes.map(i => i.sceneName).includes('scene-0') ? 'image-button' : 'hidden-image'}
                            onClick = {() => handleToHighlight(i.fileName)}>
                            <Image key={`${i.id}-img`} imagePath={i.fileName} />
                        </button>
                        {user.adminToken && <BelowImage key={`${i.id}-bel`} imageID={i.id} />}
                    </div>
                )}
            </div>
        </div>
    )
}

//root component for this module
const Images = () => {
    const [groupClass, setGroupClass] = useState('group-hidden') //keeping track of whether the progress bar is hidden
    const textLan = useSelector(i => i.view.textLan)

    return (
        <div>
            <h2 id='image-top' className='new-section'>{textLan.photos}</h2>
            <p>{textLan.photoTxt}</p>
            {groupClass !== 'group-hidden' && <ResSelect />}
            {groupClass !== 'group-hidden' && <DropDown />}
            <ImageGroup groupClass = {groupClass} setGroupClass = {setGroupClass} />
        </div>
    )
}

export default Images