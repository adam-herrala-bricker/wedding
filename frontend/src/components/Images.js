import adminServices from '../services/adminServices'
import text from '../resources/text.js'

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
const BelowImage = ({imageID, imageList, setImageList, user}) => {
    //event handler
    const handleDelete = async (imageID) => {
        await adminServices.deleteImage(imageID)
        const newFileList = imageList.filter(i => i.id !== imageID)
        setImageList(newFileList)
    }

    return(
        <div>
            {user.isAdmin && <button onClick = {() => handleDelete(imageID)}>delete</button>}
        </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({imageList, setImageList, setHighlight, user}) => {
    return(
        <div className = 'image-grouping'>
            {imageList.map(i =>
                <div key = {i.id}>
                    <button className = 'image-button' onClick = {() => setHighlight(i)}>
                        <Image key = {`${i.id}-img`} imagePath={i.fileName}/>
                    </button>
                    <BelowImage key = {`${i.id}-bel`} imageID = {i.id} imageList = {imageList} setImageList = {setImageList} user = {user}/>
                </div>
                )}
        </div>
    )
}

//root component for this module
const Images = ({imageList, setImageList, user, setHighlight, lan}) => {



    return(
        <div>
            <h2>{text.photos[lan]}</h2>
            <ImageGroup imageList = {imageList} setImageList = {setImageList} user = {user} setHighlight = {setHighlight}/>
        </div>
    )
}

export default Images