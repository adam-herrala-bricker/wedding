const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Scene = require('../models/sceneModel');
const {initializeDB} = require('../utils/test_functions');
const {
  demoEntryUserInfo,
  sampleImage,
  sampleAudio,
  sampleDemoImage,
  sampleDemoAudio,
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

  describe('a valid demo token ...', () => {
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

    describe('returns demo content', () => {
      test('image file (full res)', async () => {
        await api
            .get(`/api/images/${sampleDemoImage}?token=${demoToken}`)
            .set('referer', '/demo')
            .expect(200)
            .expect('Content-Type', /image\/jpeg/);
      });

      test('image file (web res)', async () => {
        await api
            .get(`/api/images/web-res/${sampleDemoImage}?token=${demoToken}`)
            .set('referer', '/demo')
            .expect(200)
            .expect('Content-Type', /image\/jpeg/);
      });

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

        expect(returnedData.fileName).toEqual(sampleDemoImage);
        expect(returnedData.scenes[0].sceneName).toEqual(scene1Demo.sceneName);
        expect(returnedData.isDemo).toEqual(true);
      });

      test('audio file', async () => {
        await api
            .get(`/api/audio/${sampleDemoAudio}?token=${demoToken}`)
            .set('Authorization', `Bearer ${demoToken}`)
            .set('referer', '/demo')
            .expect(200);
      });

      test('audio metadata', async () => {
        const response = await api
            .get('/api/audio-data')
            .set('Authorization', `Bearer ${demoToken}`)
            .set('referer', '/demo')
            .expect(200);

        // only one returned item (the other in DB isn't demo)
        expect(response.body).toHaveLength(1);

        const returnedData = response.body[0];
        expect(returnedData.fileName).toEqual(sampleDemoAudio);
        expect(returnedData.isDemo).toEqual(true);
      });

      test('scene metadata', async () => {
        const response = await api
            .get('/api/scenes')
            .set('Authorization', `Bearer ${demoToken}`)
            .set('referer', '/demo')
            .expect(200);

        // again, only one demo scene in DB
        expect(response.body).toHaveLength(1);

        const returnedData = response.body[0];
        expect(returnedData.sceneName).toEqual('scene1-demo');
      });
    });

    describe('cannot access non-demo content ...', () => {
      const tokenError = 'invalid signature';
      const middleWareError = 'content not found or unavailable with demo entry token'; // eslint-disable-line max-len

      describe('without demo in referer header', () => {
        test('image file (full res)', async () => {
          const response = await api
              .get(`/api/images/${sampleImage}?token=${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });

        test('image file (web res)', async () => {
          const response = await api
              .get(`/api/images/web-res/${sampleImage}?token=${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });

        test('audio file', async () => {
          const response = await api
              .get(`/api/audio/${sampleAudio}?token=${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });

        test('image metadata', async () => {
          const response = await api
              .get('/api/image-data')
              .set('Authorization', `Bearer ${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });

        test('audio metadata', async () => {
          const response = await api
              .get('/api/audio-data')
              .set('Authorization', `Bearer ${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });

        test('scene metadata', async () => {
          const response = await api
              .get('/api/scenes')
              .set('Authorization', `Bearer ${demoToken}`)
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(tokenError);
        });
      });

      describe('with demo in referer header', () => {
        test('image file (full res)', async () => {
          const response = await api
              .get(`/api/images/${sampleImage}?token=${demoToken}`)
              .set('referer', '/demo')
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(middleWareError);
        });

        test('image file (web res)', async () => {
          const response = await api
              .get(`/api/images/web-res/${sampleImage}?token=${demoToken}`)
              .set('referer', '/demo')
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(middleWareError);
        });

        test('audio file', async () => {
          const response = await api
              .get(`/api/audio/${sampleAudio}?token=${demoToken}`)
              .set('referer', '/demo')
              .expect(400)
              .expect('Content-Type', /application\/json/);

          expect(response.body.error).toEqual(middleWareError);
        });

        // reminder: metadata requests use the same endpoints for default and
        // demo entries , so we wouldn't expect them to fail like the media
        // requests, just to only return demo metadata (as is tested above)
      });
    });
  });
});

// cannot access default content with demo tokens

// cannot access demo content with default tokens

afterAll(async () => {
  await mongoose.connection.close();
});

