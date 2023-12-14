const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true, minLength: 3},
  displayname: {type: String, required: true, unique: true, minLength: 3},
  email: {type: String, required: true, unique: true,
    validate: {validator: function(i){return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)$/.test(i)}}, // eslint-disable-line
    message: () => {
      'invalid email format';
    },
  },
  isAdmin: {type: Boolean, default: false},
  passwordHash: {type: String, required: true},
  adminHash: {type: String},
  isDemo: {type: Boolean, default: false},
  picturesTaggedIn: [
    {
      // this is for populating w all the pictures they're tagged in
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pic',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.adminHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
