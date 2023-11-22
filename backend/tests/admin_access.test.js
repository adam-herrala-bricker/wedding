const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');
const {
  entryUserCredentials,
  image1,
  audio1,
} = require('../utils/test_constants');

// setup test DB
beforeAll(async () => {
  // add entry 'user'
  await User.deleteMany({});
  const entryUser = new User(entryUserCredentials);
  await entryUser.save();
});


describe('metadata requests', () => {
  // setup DB for metadata tests
  beforeAll(async () => {
    // add scene metadata
    await Scene.deleteMany({});
    const scene1 = new Scene({sceneName: 'scene1'});
    const scene1ID = scene1._id;
    await scene1.save();

    // add image metadata
    await Image.deleteMany({});
    const addImage1 = new Image({...image1, scenes: [scene1ID]});
    await addImage1.save();
    await addImage1.populate('scenes', {sceneName: 1});

    // add audio metadata
    await Audio.deleteMany({});
    const addAudio1 = new Audio(audio1);
    await addAudio1.save();
  });

  describe('fail when no admin token given', () => {
    test('image PUT', async () => {
      // need this to get id of image in DB
      const imageData = await Image.find({}).populate('scenes', {sceneName: 1});
      const thisImage = imageData[0];
      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .send({
            fileName: '_DSC0001.jpg',
            scenes: sceneIDs,
          })
          .expect(400);

      expect(response.body.error).toEqual('jwt must be provided');
    });
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});

// good login, bad login, "trojan horse" login
// returns token, upload, delete, add scene
