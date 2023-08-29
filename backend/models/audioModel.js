//Note: as with the images, this is only for the audio metadata, not the file itself
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const audioSchema = new mongoose.Schema({
    fileName : {type: String, unique: true, required: true}
})

audioSchema.plugin(uniqueValidator)

audioSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

const Audio = mongoose.model('Audio', audioSchema)

module.exports = Audio
