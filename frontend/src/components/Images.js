import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ProgressBar } from 'react-bootstrap'
import { setScroll } from '../reducers/viewReducer'
import { updateScene } from '../reducers/sceneReducer'
import ResSelect from './ResSelect'
import adminServices from '../services/adminServices'
import imageServices from '../services/imageServices'
import { getText } from '../resources/text.js'
import DropDown from './dropdownMenu.js'
import helpers from '../utilities/helpers'

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
const BelowImage = ({ imageID, imageList, setImageList }) => {
    const dispatch = useDispatch()
    const scenes = useSelector(i => i.scenes.list)

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
        dispatch(setScroll(window.scrollY)) //keep from jumping around afterwards

        //single object with value = array of list of image IDs!
        const updatedIDs = isLinked(scene, imageID)
            ? [...scene.images.filter(i => i.id !== imageID).map(i => i.id)]
            : [...scene.images.map(i => i.id), imageID]

        dispatch(updateScene(scene.id, updatedIDs))

        //update image DB too (also needs object in same format as scene)
        const thisImage = imageList.filter(i => i.id === imageID)[0]
        thisImage.scenes = isLinked(scene, imageID)
            ? thisImage.scenes.map(i => i.id).filter(i => i !== scene.id)
            : thisImage.scenes.map(i => i.id).concat(scene.id)

        const returnedImage = await imageServices.updateImageData({ id: imageID, scenes: thisImage.scenes })

        const newImageList = [...imageList.filter(i => i.id !== imageID), returnedImage]

        newImageList.sort(helpers.compareImages)
        setImageList(newImageList)

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
                    {getText(i.sceneName.replace('-', '')) || i.sceneName}
                </button>
            )}
        </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({ groupClass, setGroupClass, imageList, setImageList }) => {
    const [loadProgress, setLoadProgress] = useState(0) //how many images have loaded 
    const progressRef = useRef(0)
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(i => i.user)

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
            {groupClass === 'group-hidden' && <div>{getText('loading')} {loadProgress}/{imageList.length}</div>}
            {groupClass === 'group-hidden' && <ProgressBar now={loadProgress} max={imageList.length} style={{ maxWidth: 500 }} />}
            <div className = 'image-grouping' onLoad={handleNewLoad}>
                {imageList.map(i =>
                    <div id={i.id} key={i.id}>
                        <button className={i.scenes.map(i => i.sceneName).includes('scene-0') ? 'image-button' : 'hidden-image'}
                            onClick = {() => handleToHighlight(i.fileName)}>
                            <Image key={`${i.id}-img`} imagePath={i.fileName} />
                        </button>
                        {user.adminToken && <BelowImage key={`${i.id}-bel`} imageID={i.id} imageList={imageList} setImageList={setImageList} />}
                    </div>
                )}
            </div>
        </div>
    )
}

//root component for this module
const Images = ({ imageList, setImageList }) => {
    const [groupClass, setGroupClass] = useState('group-hidden') //keeping track of whether the progress bar is hidden

    return (
        <div>
            <h2 id='image-top' className='new-section'>{getText('photos')}</h2>
            <p>{getText('photoTxt')}</p>
            {groupClass !== 'group-hidden' && <ResSelect />}
            {groupClass !== 'group-hidden' && <DropDown setImageList={setImageList} />}
            <ImageGroup groupClass = {groupClass} setGroupClass = {setGroupClass} imageList={imageList} setImageList={setImageList} />
        </div>
    )
}

export default Images