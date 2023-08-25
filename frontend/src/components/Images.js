import { useState, useEffect } from 'react'
import imageServices from '../services/imageServices'

//component for rendering each image
const Image = ({imagePath}) => {
    const baseURL = '/api/images'
    return(
        <div><img src = {`${baseURL}/${imagePath}`}/> </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({imageList}) => {
    return(
        <div>
            {imageList.map(i =>
                <Image key = {i} imagePath={i}/>)}
        </div>
    )
}

//root component for this module
const Images = () => {
    const [imageList, setImageList] = useState([])

    //effect hook to load image list on first render (need to put the async inside so it doesn't throw an error)
    const setImageFiles = () => {
        const fetchData = async () => {
            const response = await imageServices.getImageData()
            setImageList(response.map(i => i.fileName))
        }
        fetchData()
    }

    useEffect(setImageFiles, [])

    return(
        <div>
            <h2>Images</h2>
            <ImageGroup imageList = {imageList}/>
        </div>
    )
}

export default Images