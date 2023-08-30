//NOTE: the audio and image uploads have very similar structures
//on refactor, see if they can't be merged into a single one

const uploadRouter = require('express').Router()
const Image = require('../models/imageModel')
const Scene = require('../models/sceneModel')
const Audio = require('../models/audioModel')

//middleware for handling multipart form data (aka files)
const multer = require('multer')

//so we can have the file extensions on all the file names
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const storageAudio = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/audio')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploadImages = multer({storage : storageImage}) //simpler method, but leaves off extension: const upload = multer({dest: './media/images/'}) 
const uploadAudio = multer({storage : storageAudio})

//authentication function for multer
const authorizeUser = (request, response, next) => {
   if (!request.user) {
    return response.status(401).json({ error: 'valid token required' })
   }
    
   next()
}


//FINALLY the actual router for uploading images
uploadRouter.post('/images', uploadImages.array('adminUpload'), authorizeUser, (request, response, next) => {
    //saves the metadata to the DB
    console.log(request.files)
    const filesNames = request.files.map(i => i.filename)

    filesNames.forEach( async (i) => {
        //will need to change so all's id isn't hard coded in
        //NOTE: When starting from stratch, need to create a new scene for 'all' (can do this from FE)
        //AND put its id here BEFORE adding any images
        const sceneAllID = '64ee336805aebd76bb279013'

        //image DB
        const imageMetadata = new Image({fileName: i, scenes : [sceneAllID]})
        const savedMetadata = await imageMetadata.save()
        await savedMetadata.populate('scenes')

        //scenes DB (adding to 'all' as default)
        const sceneAllData = await Scene.findById(sceneAllID)

        sceneAllData.images = sceneAllData.images.concat(savedMetadata._id)
        
        console.log(sceneAllData)

        await sceneAllData.save()

    })

    response.status(200).send() //maybe want to return array of saved metaData? unclear if that's necessary

    next()
})

//router for uploading audio
uploadRouter.post('/audio', uploadAudio.array('adminUpload'), authorizeUser, (request, response, next) => {
    //save metadata to audio DB
    const fileNames = request.files.map(i => i.filename)
    fileNames.forEach (async (i) => {
        const audioMetadata = new Audio({fileName : i})
        await audioMetadata.save()
    })

   

    response.status(200).send()
    next()
})


module.exports = uploadRouter


