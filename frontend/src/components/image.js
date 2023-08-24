import { useState } from 'react'
import adminServices from '../services/adminServices'

const Image = () => {
    //states
    const [images, setImages] = useState([])
    const [imagesURLs, setImageURLs] = useState([])

    //event handlers
    const uploadHandler = (event) => {
        event.preventDefault()

        const currentFiles = [...event.target.files]
        //const currentFileURLs = currentFiles.map(i => URL.createObjectURL(i))
        console.log(currentFiles)
        const currentFilesURL = currentFiles.map((i) => URL.createObjectURL(i))
        console.log(currentFilesURL)
        adminServices.postImage(currentFiles[0])

        setImages(currentFiles)

    }


    return(
        <input type = "file" id = "file" name = "testName" accept = "image/png" encType = "multipart/form-data" multiple = {true} onChange = {uploadHandler}/>

    )
    /*
    return(
        <div>
            <form method = "post" encType = "multipart/form-data" onSubmit={uploadHandler}>
                <input type = "file" id = "file" accept = "image/png" multiple = {true}/>
                <button type = "submit">submit!</button>
            </form>

            
        </div>
    )
    */
   
}




export default Image