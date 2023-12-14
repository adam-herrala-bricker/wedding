// for adding an isDemo field to existing entries in the DBs,
// which is set to false (since everything there isn't demo)
// make sure to run with NODE_ENV=... node ad_isDemo_false.js
// so that you get the right DB
// also need to run from one level up for config to get NODE_ENV

const {mongourl} = require('../utils/config');
const mongoose = require('mongoose');
const Audio = require('../models/audioModel');
const Images = require('../models/imageModel');
const Scenes = require('../models/sceneModel');
const User = require('../models/userModel');

const connectToDB = async () => {
  mongoose.connect(mongourl);
  console.log('Connected to DB!');
  await Audio.updateMany({}, {isDemo: false});
  await Images.updateMany({}, {isDemo: false});
  await Scenes.updateMany({}, {isDemo: false});
  await User.updateMany({}, {isDemo: false});
  console.log('Updated successfully!');
  mongoose.connection.close();
};

mongoose.set('strictQuery', false);
connectToDB().catch((err) => console.log(err));
