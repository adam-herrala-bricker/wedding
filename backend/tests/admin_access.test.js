const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const {ENTRY_KEY} = require('../utils/config');
const {initializeDB} = require('../utils/test_functions');
const {badAdminToken} = require('../utils/test_constants');

// variables to use throughout (you can't introduce variables in beforeAll)
let adminToken;
let entryToken;

// login function to get admin token
const getAdminToken = async () => {
  const adminCredentials = {username: 'test.admin', password: 'example'};
  const response = await api
      .post('/api/login')
      .send(adminCredentials);

  return response.body.adminToken;
};

// login funtion to get entry token
const getEntryToken = async () => {
  const entryCredentials = {username: 'entry', password: ENTRY_KEY};
  const entryResponse = await api.post('/api/login').send(entryCredentials);
  const entryToken = entryResponse.body.token;

  return entryToken;
};

// setup test DB
beforeAll(async () => {
  await initializeDB();

  // set tokens
  adminToken = await getAdminToken();
  entryToken = await getEntryToken();
}, 10000);

describe('metadata requests ...', () => {
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

  describe('fail when malformed token given', () => {
    test('image PUT', async () => {
      // need this to get id of image in DB
      const thisImage = await Image
          .findOne({})
          .populate('scenes', {sceneName: 1});
      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${badAdminToken}`)
          .send({
            fileName: '_DSC0001.jpg',
            scenes: sceneIDs,
          })
          .expect(400);

      expect(response.body.error).toEqual('jwt malformed');
    });

    test('image DELETE', async () => {
      // get id of image in DB
      const thisImage = await Image.findOne({});
      const imageID = thisImage._id.toString();

      const response = await api
          .delete(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${badAdminToken}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt malformed');
    });

    test('audio DELETE', async () => {
      // get id of audio in DB
      const thisAudio = await Audio.findOne({});
      const audioID = thisAudio._id.toString();

      const response = await api
          .delete(`/api/audio-data/${audioID}`)
          .set('Authorization', `Bearer ${badAdminToken}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt malformed');
    });

    test('scene POST', async () => {
      const sceneName = 'scene-22';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${badAdminToken}`)
          .send({sceneName})
          .expect(400);

      expect(response.body.error).toEqual('jwt malformed');
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({});
      const sceneID = thisScene._id.toString();

      const response = await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${badAdminToken}`)
          .expect(400);

      expect(response.body.error).toEqual('jwt malformed');
    });
  });

  describe('fail when invalid (i.e. entry) token given', () => {
    test('image PUT', async () => {
      // need this to get id of image in DB
      const thisImage = await Image
          .findOne({})
          .populate('scenes', {sceneName: 1});
      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${entryToken}`)
          .send({
            fileName: '_DSC0001.jpg',
            scenes: sceneIDs,
          })
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('image DELETE', async () => {
      // get id of image in DB
      const thisImage = await Image.findOne({});
      const imageID = thisImage._id.toString();

      const response = await api
          .delete(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${entryToken}`)
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('audio DELETE', async () => {
      // get id of audio in DB
      const thisAudio = await Audio.findOne({});
      const audioID = thisAudio._id.toString();

      const response = await api
          .delete(`/api/audio-data/${audioID}`)
          .set('Authorization', `Bearer ${entryToken}`)
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('scene POST', async () => {
      const sceneName = 'scene-22';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${entryToken}`)
          .send({sceneName})
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({});
      const sceneID = thisScene._id.toString();

      const response = await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${entryToken}`)
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });
  });

  describe('succeed with valid admin token', () => {
    test('image PUT', async () => {
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

      // returns correct metadata
      expect(response.body.fileName).toEqual('_DSC0001.jpg');

      const returnedSceneIDs = response.body.scenes.map((i) => i.id);
      expect(returnedSceneIDs).toMatchObject(sceneIDs);

      // correct metadata in DB
      const metadataDB = await Image.findById(imageID);
      expect(metadataDB.fileName).toEqual('_DSC0001.jpg');

      const sceneIDsDB = metadataDB.scenes.map((i) => i.toString());
      expect(sceneIDsDB).toMatchObject(sceneIDs);
    });

    test('scene POST', async () => {
      const sceneName = 'scene-22';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({sceneName})
          .expect(201);

      // returns correct metadata
      expect(response.body.sceneName).toEqual('scene-22');

      // metadata in DB
      const metadataDB = await Scene.findOne({sceneName: sceneName});
      expect(metadataDB.sceneName).toEqual('scene-22');
      expect(metadataDB.images).toEqual([]);
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({});
      const sceneID = thisScene._id.toString();

      await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(204);

      // entry removed from DB
      const updatedEntry = await Scene.findById(sceneID);
      expect(updatedEntry).toEqual(null);
    });

    // note: tests that require deleting files
    // can be found in ./admin_files.test.js
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
