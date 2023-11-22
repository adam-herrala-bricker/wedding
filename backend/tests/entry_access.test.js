const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');
const {ENTRY_HASH, ENTRY_KEY} = require('../utils/config');

const sampleImage = '_DSC0815.jpg';
const sampleAudio = 'down-the-aisle.mp3';

// for entry, an entry key is checked against a pseudouser called 'entry'
const entryUserCredentials = {
  username: 'entry',
  displayname: 'entry',
  email: 'entryuser@gmail.com',
  passwordHash: ENTRY_HASH,
  isAdmin: false,
  adminHash: '',
};

// image metadata
const image1 = {
  fileName: '_DSC9999.jpg',
  people: [],

};

// audio metadata
const audio1 = {
  fileName: 'groovyJamz.mp3',
};

// runs once at beginning, before any tests, to set up DB
beforeAll(async () => {
  // add entry 'user'
  await User.deleteMany({});
  const entryUser = new User(entryUserCredentials);
  await entryUser.save();

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

describe('requests to root path', () => {
  test('getting app returns 200', async () => {
    await api.get('/').expect(200);
  });
  test('getting app returns expected title', async () => {
    const response = await api.get('/');
    expect(response.text).toContain('Herrala Bricker 2023');
  });
});

describe('entry token creation', () => {
  test('entry key returns token + user object', async () => {
    const entryCredentials = {username: 'entry', password: ENTRY_KEY};
    const response = await api.post('/api/login')
        .send(entryCredentials)
        .expect(200);
    const returnedUser = response.body;

    expect(returnedUser.token).toBeDefined();
    expect(returnedUser.adminToken).toBeNull();
    expect(returnedUser.isAdmin).toEqual(false);
    expect(returnedUser.username).toEqual('entry');
  });

  test('entry rejected if invalid key', async () => {
    const badCredentials = {username: 'entry', password: 'letMeIn'};
    const response = await api.post('/api/login')
        .send(badCredentials)
        .expect(401);

    expect(response.body.error).toEqual('invalid username or password');
    expect(response.body.token).toBeUndefined();
  });
});

describe('no entry token --> bad metadata requests', () => {
  test('audio metadata fails', async () => {
    const response = await api.get('/api/audio-data').expect(400);
    expect(response.body.error).toEqual('jwt must be provided');
  });

  test('image metadata fails', async () => {
    const response = await api.get('/api/image-data').expect(400);
    expect(response.body.error).toEqual('jwt must be provided');
  });

  test('scene metadata fails', async () => {
    const response = await api.get('/api/scenes').expect(400);
    expect(response.body.error).toEqual('jwt must be provided');
  });
});

describe('no entry token --> rejected media requests', () => {
  test('image request', async () => {
    // content type check is especially important bc it's inconsistent w media
    const response = await api.get(`/api/images/${sampleImage}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toEqual('entry token required');
  });
  test('audio request', async () => {
    const response = await api.get(`/api/audio/${sampleAudio}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toEqual('entry token required');
  });
});

// still to do: invalid entry token, wrong entry token type (?)

describe('entry token --> access granted', () => {
  // helper function to get entry token
  const getEntryToken = async () => {
    const entryCredentials = {username: 'entry', password: ENTRY_KEY};
    const entryResponse = await api.post('/api/login').send(entryCredentials);
    const entryToken = entryResponse.body.token;

    return entryToken;
  };

  // helper function to get the scene 1 metadata
  const getScene1 = async (entryToken) => {
    const response = await api
        .get('/api/scenes')
        .set('Authorization', `Bearer ${entryToken}`);

    return response.body[0];
  };

  // and then the actual tests
  test('image request (web res)', async () => {
    const entryToken = await getEntryToken();
    await api
        .get(`/api/images/web-res/${sampleImage}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /image\/jpeg/);
  });

  test('image request (full res)', async () => {
    const entryToken = await getEntryToken();
    await api
        .get(`/api/images/${sampleImage}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /image\/jpeg/);
  });

  test('image metadata', async () => {
    const entryToken = await getEntryToken();
    const scene1 = await getScene1(entryToken);
    const response = await api
        .get('/api/image-data')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    const imageData = response.body[0];
    expect(imageData.fileName).toEqual('_DSC9999.jpg');
    expect(imageData.scenes[0].sceneName).toEqual(scene1.sceneName);
    expect(imageData.scenes[0].id).toEqual(scene1.id);
  });

  test('audio request', async () => {
    const entryToken = await getEntryToken();
    await api
        .get(`/api/audio/${sampleAudio}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /audio\/mpeg/);
  });

  test('audio metadata', async () => {
    const entryToken = await getEntryToken();
    const response = await api
        .get('/api/audio-data')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    expect(response.body[0].fileName).toEqual('groovyJamz.mp3');
  });

  test('scene metadata', async () => {
    const entryToken = await getEntryToken();
    const response = await api
        .get('/api/scenes')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    const scene1 = response.body[0];
    expect(scene1.sceneName).toEqual('scene1');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
