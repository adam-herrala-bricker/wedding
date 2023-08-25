//component for rendering each image
const Image = ({imagePath}) => {
    const baseURL = '/api/images'
    return(
        <div><img className = 'single-image' alt = '' src = {`${baseURL}/${imagePath}`}/> </div>
    )
}

//component for grouping together each rendered image
const ImageGroup = ({imageList}) => {
    return(
        <div className = 'image-grouping'>
            {imageList.map(i =>
                <Image key = {i} imagePath={i}/>)}
        </div>
    )
}

//root component for this module
const Images = ({imageList}) => {



    return(
        <div>
            <h2>Images</h2>
            <ImageGroup imageList = {imageList}/>
        </div>
    )
}

export default Images