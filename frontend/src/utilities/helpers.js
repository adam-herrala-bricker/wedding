//helper functions that are needed at multipl locations
const compareImages = (image1, image2) => {
    if (image1.fileName > image2.fileName) {
        return 1
    } else if (image1.fileName < image2.fileName) {
        return -1
    } else {
        return 0
    }
    } 

export default {compareImages}