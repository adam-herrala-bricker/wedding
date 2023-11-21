// Note: as with images, this is only for the audio metadata, not the files
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const audioSchema = new mongoose.Schema({
  fileName: {type: String, unique: true, required: true},
});

audioSchema.plugin(uniqueValidator);

audioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
