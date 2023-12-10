const fs = require('fs');
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');
const {
  entryUserCredentials,
  sampleImage,
  sampleAudio,
  image1,
  image2,
  sampleImageDB,
  audio1,
  audio2,
  audioSourcePath,
  audioDestinationPath,
  imageSourcePath,
  imageDestinationPath,
} = require('../utils/test_constants');

const initializeDB = async () => {
  // clear database
  await User.deleteMany({});
  await Scene.deleteMany({});
  await Image.deleteMany({});
  await Audio.deleteMany({});

  // entry 'user'
  const entryUser = new User(entryUserCredentials);

  // scene metadata
  const scene1 = new Scene({sceneName: 'scene1'});
  const scene1ID = scene1._id;

  // scene metadata (demo)
  const scene1Demo = new Scene({sceneName: 'scene1-demo', isDemo: true});
  const scene1DemoID = scene1Demo._id;


  // image metadata
  const addImage1 = new Image({...image1, scenes: [scene1ID]});

  // image metadata (demo)
  const addImage2 = new Image({...image2, scenes: [scene1DemoID]});

  // image metadata (sample image)
  const addSampleImage = new Image({...sampleImageDB, scenes: [scene1ID]});

  // audio metadata
  const addAudio1 = new Audio(audio1);

  // audio metadata (demo)
  const addAudio2 = new Audio(audio2);

  // fulfil (most) promises at once
  const promiseArray = [
    entryUser.save(),
    scene1.save(),
    scene1Demo.save(),
    addImage1.save(),
    addImage2.save(),
    addSampleImage.save(),
    addAudio1.save(),
    addAudio2.save(),
  ];

  await Promise.all(promiseArray);

  // down here because Promise.all() fulfils promises in parallel
  await addImage1.populate('scenes', {sceneName: 1});

  // add sampleImage + sampleAudio to /media (if not already)
  console.log('Prior to entry access tests ...');
  try {
    fs.linkSync(`${audioSourcePath}/${sampleAudio}`,
        `${audioDestinationPath}/${sampleAudio}`);
    console.log(`${sampleAudio} added to ${audioDestinationPath}`);
  } catch (EEXIST) {
    console.log(`${sampleAudio} already in ${audioDestinationPath}`);
  }

  try {
    fs.linkSync(`${imageSourcePath}/${sampleImage}`,
        `${imageDestinationPath}/${sampleImage}`);
    console.log(`${sampleImage} added to ${imageDestinationPath}`);
  } catch (EEXIST) {
    console.log(`${sampleImage} already in ${imageDestinationPath}`);
  }
};

module.exports = {initializeDB};
