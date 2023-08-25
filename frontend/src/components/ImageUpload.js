import { useState } from 'react'
import adminServices from '../services/adminServices'

const ImageUpload = () => {
    //states
    const [images, setImages] = useState([''])

    //event handlers
    const handleUpload = (event) => {
        event.preventDefault()

        const currentFiles = [...event.target.files] //need to make an array
        console.log(currentFiles)
        setImages(currentFiles)
    }

    const handleSubmit = () => {
        images.forEach(i => adminServices.postImage(i))
        //something to-reload page?
    }


    return(
        <div>
                <input type = "file" id = "file" name = "testName" accept = "image/png" encType = "multipart/form-data" multiple onChange = {handleUpload}/>
                <button onClick = {handleSubmit}>submit</button>
        </div>
    )
}




export default ImageUpload