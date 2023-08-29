const uploadRouter = require('express').Router()
const Image = require('../models/imageModel')
const Scene = require('../models/sceneModel')

//middleware for handling multipart form data (aka files)
const multer = require('multer')

//so we can have the file extensions on all the file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/images/')
    },
    filename: (req, file, cb) => {
        const uniqueBody = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueBody}.png`) //may consider using original file name --> can check for dulicates that way?
    }
})

const upload = multer({storage: storage}) //simpler method, but leaves off extension: const upload = multer({dest: './media/images/'}) 

//authentication function for multer
const authorizeUser = (request, response, next) => {
   if (!request.user) {
    return response.status(401).json({ error: 'valid token required' })
   }
    
   next()
}


//FINALLY the actual router for uploading images
uploadRouter.post('/images', upload.array('testName'), authorizeUser, (request, response, next) => {
    //ADAM NOTE: This is currently set to handle posting the metadata to the DB as if the single 
    //POST request gets all the files at once. But looking at the logging I think it might actually
    //get it one at a time, since we're seeing a seperate POST request and file for each.
    //This would mean that itterating over every file in files is unnecessary, since it's always 
    //an array of a single file. Maybe look into this when you're cleaning up for production?
    
    //saves the metadata to the DB
    console.log(request.files)
    const filesNames = request.files.map(i => i.filename)

 

    filesNames.forEach( async (i) => {
        //will need to change so all's id isn't hard coded in
        const sceneAllID = '64eda84d96e691d0cc0776ca'

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




module.exports = uploadRouter


