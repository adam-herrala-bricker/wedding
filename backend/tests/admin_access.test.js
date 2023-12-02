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
  getAdminUserCredentials,
} = require('../utils/test_constants');

// setup test DB
beforeAll(async () => {
  // clear users from DB
  await User.deleteMany({});

  // add entry 'user'
  const entryUser = new User(entryUserCredentials);
  await entryUser.save();

  // add admin user
  const adminUserCredentials = await getAdminUserCredentials();
  const adminUser = new User(adminUserCredentials);
  await adminUser.save();
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
      const thisImage = await Image
          .findOne({})
          .populate('scenes', {sceneName: 1});
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

    test('image DELETE', async () => {
      // get id of image in DB
      const thisImage = await Image.findOne({});
      const imageID = thisImage._id.toString();

      const response = await api
          .delete(`/api/image-data/${imageID}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt must be provided');
    });

    test('audio DELETE', async () => {
      // get id of audio in DB
      const thisAudio = await Audio.findOne({});
      const audioID = thisAudio._id.toString();

      const response = await api
          .delete(`/api/audio-data/${audioID}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt must be provided');
    });

    test('scene POST', async () => {
      const sceneName = 'scene-22';
      const response = await api
          .post('/api/scenes')
          .send({sceneName})
          .expect(400);

      expect(response.body.error).toEqual('jwt must be provided');
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({});
      const sceneID = thisScene._id.toString();

      const response = await api
          .delete(`/api/scenes/${sceneID}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt must be provided');
    });
  });

  // fails with bad token

  // fails with entry token

  describe('succeeds with valid admin token', () => {
    // login function to get admin to get token
    const getAdminToken = async () => {
      const adminCredentials = {username: 'test.admin', password: 'example'};
      const response = await api
          .post('/api/login')
          .send(adminCredentials);

      return response.body.adminToken;
    };

    test('image PUT', async () => {
      const adminToken = await getAdminToken();

      // get id of image in DB
      const thisImage = await Image
          .findOne({})
          .populate('scenes', {sceneName: 1});

      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            fileName: '_DSC0001.jpg',
            scenes: sceneIDs,
          })
          .expect(200);

      expect(response.body.fileName).toEqual('_DSC0001.jpg');
    });

    test('scene POST', async () => {
      const adminToken = await getAdminToken();

      const sceneName = 'scene-22';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({sceneName})
          .expect(201);

      expect(response.body.sceneName).toEqual('scene-22');
    });

    test('scene DELETE', async () => {
      const adminToken = await getAdminToken();

      // get id of scene in DB
      const thisScene = await Scene.findOne({});
      const sceneID = thisScene._id.toString();

      await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(204);
    });

    // note: tests that require deleting files
    // can be found in ./admin_files.test.js
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});
