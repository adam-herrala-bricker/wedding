import { useState } from 'react'
import adminServices from '../services/adminServices'
import imageServices from '../services/imageServices'
import helpers from '../utilities/helpers'


//NOTE: The name is a bit unfortunate, since we're using this to handle uploading audio files as well
//and it could be easily expanded to handle video if needed
const ImageUpload = ({setImageList}) => {
    const acceptedFiles = ["image/png", "image/jpeg", "audio/wav", "audio/mp3"]
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
            console.log(i.type)
        
            //route for image upload
            if (i.type === 'image/png' | i.type === 'image/jpeg') {
                await adminServices.postImage(i)
                //FINALLY got it to consistently reload after uploading new images
                //Think the original problem was it was fetching the new server data too quickly to load the updates
                //idk if this is the correct solution, but slowing it down seems to work at least
                setTimeout(async () => {
                    const newImageList = await imageServices.getImageData()
                    newImageList.sort(helpers.compareImages)
                    setImageList(newImageList)
                }, 1000)
            //route for audio upload     
            } else if (i.type === 'audio/wav' | i.type === 'audio/x-wav' |i.type === 'audio/mp3' | i.type === 'audio/mpeg') {
                console.log('audio upload')
                await adminServices.postAudio(i)
            }
        })
    }

    return(
        <div>
            <h2>Upload files</h2>
            <form onSubmit={handleSubmit}>
                <input type = "file" id = "file" name = "adminUpload" accept = {acceptedFiles}  encType = "multipart/form-data" multiple onChange = {handleUpload}/>
                <button type='submit'>submit</button>
            </form>
            
        </div>
    )
}


export default ImageUpload