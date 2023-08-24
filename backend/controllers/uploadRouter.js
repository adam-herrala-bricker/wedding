const uploadRouter = require('express').Router()

//middleware for handling multipart form data (aka files)
const multer = require('multer')

//so we can have the file extensions on all the file names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}.png`)
    }
})

const upload = multer({storage: storage}) //simpler method, but leaves off extension: const upload = multer({dest: './media/images/'}) 


//uploading images
uploadRouter.post('/images', upload.single('testName'), async (request, response, next) => {
    console.log(request.file)
    response.status(200).send()

    next()
})




module.exports = uploadRouter


