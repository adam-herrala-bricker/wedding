const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const sceneSchema = new mongoose.Schema({
    sceneName : {type: String, required: true, unique: true},
    images : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        }
    ]
})

sceneSchema.plugin(uniqueValidator)

sceneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Scene = mongoose.model('Scene', sceneSchema)

module.exports = Scene