import { useState } from 'react'
import adminServices from '../services/adminServices'
import imageServices from '../services/imageServices'

const ImageUpload = ({setImageList}) => {
    const [images, setImages] = useState([''])
    

    //event handlers
    const handleUpload = (event) => {
        event.preventDefault()

        const currentFiles = [...event.target.files] //need to make an array
        console.log(currentFiles)
        setImages(currentFiles)
    }

    const handleSubmit = async () => {
        images.forEach(async (i) => {
            await adminServices.postImage(i)
        })

        //NEED TO FIGURE OUT WHY THIS ISN'T REFRESHING ON THIS RENDER!!!
        //AND THEN ONCE IT'S WORKING, TAKE ANOTHER LOOK AT WHICH STATES AND FUNCTIONS NEED TO LIVE WHERE
        const newImageList = await imageServices.getImageData()
            console.log(newImageList)
            setImageList(newImageList.map(i => i.fileName))
    }

    return(
        <div>
            <h2>upload images</h2>
            <input type = "file" id = "file" name = "testName" accept = "image/png" encType = "multipart/form-data" multiple onChange = {handleUpload}/>
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}




export default ImageUpload