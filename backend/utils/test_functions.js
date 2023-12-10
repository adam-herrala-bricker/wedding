const fs = require('fs');
const bcrypt = require('bcrypt');
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');
const {ADMIN_KEY} = require('../utils/config');
const {
  badAdminKey,
  entryUserCredentials,
  sampleImage,
  sampleAudio,
  sampleDemoAudio,
  sampleImageDB,
  sampleDemoImageDB,
  sampleAudioDB,
  sampleDemoAudioDB,
  audioSourcePath,
  audioDestinationPath,
  imageSourcePath,
  imageDestinationPath,
  sampleDemoImage,
} = require('../utils/test_constants');

// admin user (replicate what happens on the BE)
const getAdminUserCredentials = async () => {
  const dummyPasswordAdmin = 'example';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(dummyPasswordAdmin, saltRounds);
  const adminHash = await bcrypt.hash(ADMIN_KEY, saltRounds);

  const thisUser = {
    username: 'test.admin',
    displayname: 'Test Admin',
    email: 'test.admin@gmail.org',
    passwordHash: passwordHash,
    isAdmin: true,
    adminHash: adminHash,
  };

  return thisUser;
};

// standard user (also replicates BE)
const getStandardUserCredentials = async () => {
  const dummyPasswordAdmin = 'example';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(dummyPasswordAdmin, saltRounds);

  const thisUser = {
    username: 'test.standard',
    displayname: 'Test Standard',
    email: 'test.standard@gmail.org',
    passwordHash: passwordHash,
    isAdmin: false,
    adminHash: '',
  };

  return thisUser;
};

// "imposter" user (somehow gets onto DB as isAdmin = true,
// but didn't have ADMIN_KEY)
const getImposterCredentials = async () => {
  const dummyPassword = 'example';
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(dummyPassword, saltRounds);
  const adminHash = await bcrypt.hash(badAdminKey, saltRounds);

  const thisUser = {
    username: 'test.imposter',
    displayname: 'Test Imposter',
    email: 'test.imposter@gmail.org',
    passwordHash: passwordHash,
    isAdmin: true,
    adminHash: adminHash,
  };

  return thisUser;
};

const initializeDB = async () => {
  // clear database
  await User.deleteMany({});
  await Scene.deleteMany({});
  await Image.deleteMany({});
  await Audio.deleteMany({});

  // entry 'user'
  const entryUser = new User(entryUserCredentials);

  // add admin user
  const adminUserCredentials = await getAdminUserCredentials();
  const adminUser = new User(adminUserCredentials);

  // scene metadata
  const scene1 = new Scene({sceneName: 'scene1'});
  const scene1ID = scene1._id;

  // scene metadata (demo)
  const scene1Demo = new Scene({sceneName: 'scene1-demo', isDemo: true});
  const scene1DemoID = scene1Demo._id;

  // image metadata (sample default image)
  const addSampleImage = new Image({...sampleImageDB, scenes: [scene1ID]});

  // image metadata (sample demo image)
  const addSampleDemoImage = new Image({...sampleDemoImageDB, scenes: [scene1DemoID]}); // eslint-disable-line max-len

  // audio metadata
  const addSampleAudio = new Audio(sampleAudioDB);

  // audio metadata (demo)
  const addSampleDemoAudio = new Audio(sampleDemoAudioDB);

  // fulfil (most) promises at once
  const promiseArray = [
    entryUser.save(),
    adminUser.save(),
    scene1.save(),
    scene1Demo.save(),
    addSampleImage.save(),
    addSampleDemoImage.save(),
    addSampleAudio.save(),
    addSampleDemoAudio.save(),
  ];

  await Promise.all(promiseArray);

  // down here because Promise.all() fulfils promises in parallel
  await addSampleImage.populate('scenes', {sceneName: 1});
  await addSampleDemoImage.populate('scenes', {sceneName: 1});

  // add sampleImages + sampleAudio to /media (if not already)
  const filesToSync = [
    {
      file: sampleAudio,
      source: audioSourcePath,
      destination: audioDestinationPath,
    },
    {
      file: sampleDemoAudio,
      source: audioSourcePath,
      destination: audioDestinationPath,
    },
    {
      file: sampleImage,
      source: imageSourcePath,
      destination: imageDestinationPath,
    },
    {
      file: sampleDemoImage,
      source: imageSourcePath,
      destination: imageDestinationPath,
    },
  ];

  console.log('Prior to entry access tests ...');
  filesToSync.forEach((i) => {
    try {
      fs.linkSync(`${i.source}/${i.file}`,
          `${i.destination}/${i.file}`);
      console.log(`${i.file} added to ${i.destination}`);
    } catch (EEXIST) {
      console.log(`${i.file} already in ${i.destination}`);
    }
  });
};

module.exports = {
  getAdminUserCredentials,
  getStandardUserCredentials,
  getImposterCredentials,
  initializeDB,
};
