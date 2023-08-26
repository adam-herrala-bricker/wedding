import adminServices from '../services/adminServices'

//component for rendering each image
const Image = ({imagePath}) => {
    const baseURL = '/api/images'
    return(
        <div><img className = 'single-image' alt = '' src = {`${baseURL}/${imagePath}`}/> </div>
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
const ImageGroup = ({imageList, setImageList, user}) => {
    return(
        <div className = 'image-grouping'>
            {imageList.map(i =>
                <div key = {i.id}>
                    <Image key = {`${i.id}-img`} imagePath={i.fileName}/>
                    <BelowImage key = {`${i.id}-bel`} imageID = {i.id} imageList = {imageList} setImageList = {setImageList} user = {user}/>
                </div>
                )}
        </div>
    )
}

//root component for this module
const Images = ({imageList, setImageList, user}) => {



    return(
        <div>
            <h2>Images</h2>
            <ImageGroup imageList = {imageList} setImageList = {setImageList} user = {user}/>
        </div>
    )
}

export default Images