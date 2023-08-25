const uploadRouter = require('express').Router()

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
    response.status(401).json({ error: 'valid token required' })
   }
    
   next()
}


//FINALLY the actual router for uploading images
uploadRouter.post('/images', upload.array('testName'), authorizeUser, (request, response, next) => {
    /*
    //authentication can go here
    upload(request, response, (err) => {
        next(err)
    })
    */
    console.log(request.files)
    response.status(200).send()

    next()
})




module.exports = uploadRouter


