import { useState } from 'react'
import adminServices from '../services/adminServices'
import imageServices from '../services/imageServices'

const ImageUpload = ({setImageList}) => {
    const [images, setImages] = useState([''])
    

    //event handlers
    const handleUpload = (event) => {
        event.preventDefault()

        const currentFiles = [...event.target.files] //need to make an array
        setImages(currentFiles)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        images.forEach(async (i) => {
            await adminServices.postImage(i)
            //FINALLY got it to consistently reload after uploading new images
            //Think the original problem was it was fetching the new server data too quickly to load the updates
            //idk if this is the correct solution, but slowing it down seems to work at least
            setTimeout(async () => {
                const newImageList = await imageServices.getImageData()
                setImageList(newImageList)
              }, 1000)

        })
    }

    return(
        <div>
            <h2>Upload images</h2>
            <form onSubmit={handleSubmit}>
                <input type = "file" id = "file" name = "testName" accept = "image/png" encType = "multipart/form-data" multiple onChange = {handleUpload}/>
                <button type='submit'>submit</button>
            </form>
            
        </div>
    )
}


export default ImageUpload