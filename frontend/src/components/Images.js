import { useState, useEffect, useRef, forwardRef} from 'react'
import adminServices from '../services/adminServices'
import sceneServices from '../services/sceneServices'
import imageServices from '../services/imageServices'
import text from '../resources/text.js'
import DropDown from './dropdownMenu.js'
import helpers from '../utilities/helpers'

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
const BelowImage = ({lan, imageID, imageList, setImageList, user, scenes, setScenes, compareScenes}) => {
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
        //single object with value = array of list of IDs!
        const updatedIDs = isLinked(scene, imageID)
            ? [...scene.images.filter(i => i.id !== imageID).map(i => i.id)]
            : [...scene.images.map(i => i.id), imageID]

        const updatedScene = await sceneServices.updateScene({id: scene.id, imageIDs : updatedIDs})
        const thisScene = updatedScene.sceneName
        
        //const newScenes = await sceneServices.getScenes() //too much lag this way
        const newScenes = [...scenes.filter(i => i.sceneName !== thisScene), updatedScene]

        newScenes.sort(compareScenes)

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
const ImageGroup = forwardRef(({lan, imageList, setImageList, highlight, setHighlight, user, scenes, setScenes, compareScenes}, highlightRef) => {
    const [scroll, setScroll] = useState(0) //setting Y scroll of image for returning to same place after highlight view
    const scrollRef = useRef(0)
    //event handler
    const handleSetHighlight = (i) => {
        setScroll(window.scrollY)
        highlightRef.current = window.scrollY
       
        
        
        
        
        
        
        setHighlight({current : i, outgoing: null})

        //going to try this
        //highlightRef.current = document.getElementById(i.id)
        const element = document.getElementById(i.id)
        
    }

    //going to try something else
    useEffect(() => {
      

        /*
        if (highlight.outgoing) {
            setTimeout(() => {
                
                const elementID = highlight.outgoing.id
                const element = document.getElementById(elementID)
                element?.scrollIntoView({behavior : 'smooth'})
                

                //highlightRef.current.scrollIntoView({behavior : 'smooth'})
                //console.log(highlightRef.current)
                console.log(element.scrollTop)
            }, 100)
        }
        */
    }, [])

    //window.scroll(0, scrollRef.current)
    console.log('highlightRef',highlightRef.current)
    console.log('scroll', scroll)
    window.scroll(0, highlightRef.current)
    
    return(
        <div className = 'image-grouping'>
            {imageList.map(i =>
                <div id = {i.id} key = {i.id}>
                    <button className = {i.scenes.map(i => i.sceneName).includes('scene-0') ? 'image-button' : 'hidden-image'}
                            onClick = {() => handleSetHighlight(i)}>
                        <Image key = {`${i.id}-img`} imagePath={i.fileName}/>
                    </button>
                   {user.isAdmin && <BelowImage key = {`${i.id}-bel`} lan = {lan} imageID = {i.id} imageList = {imageList} setImageList = {setImageList} user = {user} scenes = {scenes} setScenes = {setScenes} compareScenes = {compareScenes}/>}
                </div>
                )}
        </div>
    )
})

//root component for this module
const Images = forwardRef(({scenes, setScenes, imageList, setImageList, user, highlight, setHighlight, lan}, highlightRef) => {
    //helper function for sorting scenes
    //this will work for final version, but need to name scene1, scene2, etc.
    //then use the suo-eng dict for their actual names
    const compareScenes = (scene1, scene2) => {
        if (scene1.sceneName > scene2.sceneName) {
            return 1
        } else if (scene1.sceneName < scene2.sceneName) {
            return -1
        } else {
            return 0
        }
    }

    //effect hook to get scenes at first render
    useEffect(() => {
        const fetchData = async () => {
            const scenes = await sceneServices.getScenes()
            scenes.sort(compareScenes)
            setScenes(scenes)
        }
        fetchData()
    }, [imageList])



    return(
        <div>
            <h2 id = 'image-top'>{text.photos[lan]}</h2>
            <DropDown scenes = {scenes} setScenes = {setScenes} setImageList = {setImageList} user = {user} lan = {lan}/>
            <ImageGroup ref = {highlightRef} lan = {lan} imageList = {imageList} setImageList = {setImageList} user = {user} highlight = {highlight} setHighlight = {setHighlight} scenes = {scenes} setScenes = {setScenes} compareScenes = {compareScenes}/>
        </div>
    )
})

export default Images