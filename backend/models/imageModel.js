//note: this is only for the JSON data associated w each image, not the image file itself
//the image file doesn't get stored in the DB
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const imageSchema = new mongoose.Schema({
    fileName : {type: String, required: true, unique: true},
    time : {type: String}, //idk if I'll be able to extract this from the images we get, but puting it here now just in case
    people : [
        {   
            type: mongoose.Schema.Types.ObjectId,
            ref: 'People'
        }
    ],
    scenes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Scene'
        }
    ]
})

imageSchema.plugin(uniqueValidator)

imageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image