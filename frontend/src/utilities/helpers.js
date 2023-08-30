//helper function for sorting scenes
//this will work for final version, but need to name scene1, scene2, etc.
//then use the suo-eng dict for their actual names
const compareScenes = (scene1, scene2) => {
    if (scene1.sceneName > scene2.sceneName) {
        return 1
    } else if (scene1.sceneName < scene2.sceneName) {
        return -1
    } else {
        return 0
    }
}

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

export default {compareImages, compareScenes}