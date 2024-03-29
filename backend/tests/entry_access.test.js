const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Scene = require('../models/sceneModel');
const {initializeDB} = require('../utils/test_functions');
const {ENTRY_KEY, BAD_ENTRY_TOKEN} = require('../utils/config');
const {sampleImage, sampleAudio} = require('../utils/test_constants');

// runs once at beginning, before any tests, to set up the DB
beforeAll(async () => {
  await initializeDB();
}, 10000);

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
  test('valid entry key returns token + user object', async () => {
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
  test('image request (full res)', async () => {
    // content type check is especially important bc it's inconsistent w media
    const response = await api.get(`/api/images/${sampleImage}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toEqual('entry token required');
  });

  test('image request (web res)', async () => {
    const response = await api.get(`/api/images/web-res/${sampleImage}`)
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

describe('invalid entry token --> bad metadata requests', () => {
  test('audio metadata', async () => {
    const response = await api
        .get('/api/audio-data')
        .set('Authorization', `Bearer ${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });

  test('image metadata', async () => {
    const response = await api
        .get('/api/image-data')
        .set('Authorization', `Bearer ${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });

  test('scene metadata', async () => {
    const response = await api
        .get('/api/scenes')
        .set('Authorization', `Bearer ${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });
});

describe('invalid entry token --> bad media requests', () => {
  test('image request (full res)', async () => {
    const response = await api
        .get(`/api/images/${sampleImage}?token=${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });

  test('image request (web res)', async () => {
    const response = await api
        .get(`/api/images/web-res/${sampleImage}?token=${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });

  test('audio request', async () => {
    const response = await api
        .get(`/api/audio/${sampleAudio}?token=${BAD_ENTRY_TOKEN}`)
        .expect(400);
    expect(response.body.error).toEqual('invalid signature');
  });
});

describe('valid entry token --> requests granted', () => {
  let entryToken;

  // helper function to get entry token
  const getEntryToken = async () => {
    const entryCredentials = {username: 'entry', password: ENTRY_KEY};
    const entryResponse = await api.post('/api/login').send(entryCredentials);
    const entryToken = entryResponse.body.token;

    return entryToken;
  };

  // helper function to get the scene 1 metadata (directly from DB)
  const getScene1 = async () => {
    const scenes = await Scene.findOne({isDemo: false});
    return scenes;
  };

  // only need to get the entry token once
  beforeAll(async () => {
    entryToken = await getEntryToken();
  });

  // and then the actual tests
  test('image file (full res)', async () => {
    await api
        .get(`/api/images/${sampleImage}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /image\/jpeg/);
  });

  test('image file (web res)', async () => {
    await api
        .get(`/api/images/web-res/${sampleImage}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /image\/jpeg/);
  });

  test('image metadata', async () => {
    const scene1 = await getScene1();
    const response = await api
        .get('/api/image-data')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    const imageData = response.body[0];
    expect(imageData.fileName).toEqual(sampleImage);
    expect(imageData.scenes[0].sceneName).toEqual(scene1.sceneName);
    expect(imageData.scenes[0].id).toEqual(scene1.id);
  });

  test('audio file', async () => {
    await api
        .get(`/api/audio/${sampleAudio}?token=${entryToken}`)
        .expect(200)
        .expect('Content-Type', /audio\/mpeg/);
  });

  test('audio metadata', async () => {
    const response = await api
        .get('/api/audio-data')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    expect(response.body[0].fileName).toEqual(sampleAudio);
  });

  test('scene metadata', async () => {
    const response = await api
        .get('/api/scenes')
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(200);

    const scene1 = response.body[0];
    expect(scene1.sceneName).toEqual('scene-0');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
