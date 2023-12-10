const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Scene = require('../models/sceneModel');
const {initializeDB} = require('../utils/test_functions');
const {
  demoEntryUserInfo,
  image2,
  sampleImage,
} = require('../utils/test_constants');
const {ENTRY_KEY_DEMO} = require('../utils/config');

beforeAll(async () => {
  await initializeDB();
  // add 'entry-demo' pseudo-user
  await api.post('/api/users').send(demoEntryUserInfo);
});

// demo content returns as expected
describe('correct demo page function', () => {
  describe('demo page entry', () => {
    test('request to /demo', async () => {
      // note: trailing '/' is required?
      const response = await api.get('/demo/').expect(200);
      expect(response.text).toContain('Herrala Bricker 2023');
    });

    test('valid demo entry key --> token + user object', async () => {
      const entryCredentials = {
        username: 'entry-demo',
        password: ENTRY_KEY_DEMO,
      };
      const response = await api.post('/api/login')
          .set('Referer', '/demo') // NEED TO ROUTE THROUGH DEMO MW!!
          .send(entryCredentials)
          .expect(200);

      const user = response.body;

      expect(user.username).toEqual('entry-demo');
      expect(user.token).toBeDefined();
      expect(user.isDemo).toEqual(true);
      expect(user.isAdmin).toEqual(false);
      expect(user.adminToken).toBeNull();
    });
  });

  describe('demo token operations', () => {
    let demoToken;

    // helper function to get demo entry token
    const getEntryToken = async () => {
      const entryCredentials = {
        username: 'entry-demo',
        password: ENTRY_KEY_DEMO,
      };

      const entryResponse = await api.post('/api/login').send(entryCredentials);
      const entryToken = entryResponse.body.token;

      return entryToken;
    };

    // only need to get the entry token once
    beforeAll(async () => {
      demoToken = await getEntryToken();
    });

    describe('returns (only) demo content', () => {
    // images (full + web res)

      test('image metadata', async () => {
        const scene1Demo = await Scene.findOne({isDemo: true});

        const response = await api
            .get('/api/image-data')
            .set('Authorization', `Bearer ${demoToken}`)
            .set('referer', '/demo')
            .expect(200);

        // only return the isDemo entry
        expect(response.body).toHaveLength(1);
        const returnedData = response.body[0];

        expect(returnedData.fileName).toEqual(image2.fileName);
        expect(returnedData.scenes[0].sceneName).toEqual(scene1Demo.sceneName);
        expect(returnedData.isDemo).toEqual(true);
      });

    // audio
    // scenes
    });

    describe('cannot access default content', () => {
      describe('without demo in referer', () => {
        test('image file (full res)', async () => {
          await api
              .get(`/api/images/${sampleImage}?token=${demoToken}`)
              .expect(400);
        });
      });

      describe('with demo in referer', () => {
        test('image file (full res)', async () => {
          const response = await api
              .get(`/api/images/${sampleImage}?token=${demoToken}`)
              .set('referer', '/demo')
              .expect(401);

          expect(response.body.error)
              .toEqual('content not found or unavailable with demo entry token'); // eslint-disable-line max-len
        });
      });
    });
  });
});

// cannot access default content with demo tokens

// cannot access demo content with default tokens

afterAll(async () => {
  await mongoose.connection.close();
});
