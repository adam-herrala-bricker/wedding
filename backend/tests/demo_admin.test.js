// note: when the defaultStart === defaultEnd checks fail, it may
// manifest as a timeout or an error about properties not being accessed,
// not an error about the two actually being unequal
const mongoose = require('mongoose');
const fs = require('fs');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const {initializeDB} = require('../utils/test_functions');
const {
  imageDestinationPath,
  imageSourcePath,
  audioDestinationPath,
  audioSourcePath,
} = require('../utils/test_constants');

let adminToken;
let demoAdminToken;

const demoImages = [
  'DEMO_0036.jpg',
  'DEMO_0088.jpg',
  'DEMO_0094.jpg',
  'DEMO_0127.jpg',
];
const imageUploadFile = demoImages[0];
const imageToDelete = demoImages[1];

const demoAudio = [
  'down-the-aisle-demo.mp3',
  'test35.1.wav',
];
const audioUploadFile = demoAudio[0];
const audioToDelete = demoAudio[1];

// login function to get (default) admin token
const getAdminToken = async () => {
  const adminCredentials = {username: 'test.admin', password: 'example'};
  const response = await api
      .post('/api/login')
      .send(adminCredentials);
  return response.body.adminToken;
};

// login function to get (default) admin token
const getDemoAdminToken = async () => {
  const adminCredentials = {
    username: 'test.admin.demo',
    password: 'f8ofTheFuriou8',
  };
  const response = await api
      .post('/api/login')
      .send(adminCredentials);
  return response.body.adminToken;
};

// set up DB and get admin tokens
beforeAll(async () => {
  await initializeDB();
  adminToken = await getAdminToken();
  demoAdminToken = await getDemoAdminToken();

  // remove any demo image files from ./media
  demoImages.forEach((imageFile) => {
    try {
      fs.unlinkSync(`${imageDestinationPath}/${imageFile}`);
      console.log(`${imageFile} removed from ${imageDestinationPath}`);
    } catch (ENOENT) {
      console.log(`${imageFile} not in ${imageDestinationPath}`);
    }

    // and same for audio files
    demoAudio.forEach((audioFile) => {
      try {
        fs.unlinkSync(`${audioDestinationPath}/${audioFile}`);
        console.log(`${audioFile} removed from ${audioDestinationPath}`);
      } catch (ENOENT) {
        console.log(`${audioFile} not in ${audioDestinationPath}`);
      }
    });
  });
}, 10000);

// demo admin requests fail without demo admin token
// demo admin token authenticates demo admin requests
describe('demo admin token authenticates demo admin requests', () => {
  describe('file uploads', () => {
    test('a single image file', async () => {
      const defaultImagesStart = await Image.find({isDemo: false});

      const response = await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${imageUploadFile}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // returns expected metadata
      expect(response.body.fileName).toEqual(imageUploadFile);
      expect(response.body.isDemo).toEqual(true);

      // expected metadata in DB
      const metadataDB = await Image.findById(response.body.id);
      expect(metadataDB.fileName).toEqual(imageUploadFile);
      expect(metadataDB.isDemo).toEqual(true);

      // file is saved on server
      const isFile = fs.statSync(`${imageDestinationPath}/${imageUploadFile}`,
          {throwIfNoEntry: false});

      expect(isFile).toBeDefined();

      // no changes to default image metadata
      const defaultImagesEnd = await Image.find({isDemo: false});
      expect(defaultImagesStart).toStrictEqual(defaultImagesEnd);
    });

    test('a single audio file', async () => {
      const defaultAudioStart = await Audio.find({isDemo: false});

      const response = await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload',
              `${audioSourcePath}/${audioUploadFile}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // confirm that the returned metadata is correct
      expect(response.body.fileName).toEqual(audioUploadFile);

      // confirm that the returned metadata is in the DB
      const metadataDB = await Audio.findById(response.body.id);
      expect(metadataDB.fileName).toEqual(audioUploadFile);

      // confirm that the file itself is there
      const isFile = fs.statSync(`${audioDestinationPath}/${audioUploadFile}`,
          {throwIfNoEntry: false});

      expect(isFile).toBeDefined;

      // no changes to default audio metadata
      const defaultAudioEnd = await Audio.find({isDemo: false});
      expect(defaultAudioStart).toStrictEqual(defaultAudioEnd);
    });
  });

  describe('scene requests', () => {
    test('scene POST', async () => {
      const defaultScenesStart = await Scene.find({isDemo: false});

      const sceneName = 'scene-1';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .send({sceneName})
          .expect(201);

      // returns correct metadata (note the BE changes the name)
      expect(response.body.sceneName).toEqual('scene-1-demo');

      // metadata in DB
      const metadataDB = await Scene.findOne({sceneName: 'scene-1-demo'});
      expect(metadataDB.sceneName).toEqual('scene-1-demo');
      expect(metadataDB.isDemo).toEqual(true);
      expect(metadataDB.images).toEqual([]);

      // no changes to default scenes
      const defaultScenesEnd = await Scene.find({isDemo: false});
      expect(defaultScenesStart).toStrictEqual(defaultScenesEnd);
    });

    test('image PUT', async () => {
      const defaultImagesStart = await Image.find({isDemo: false});

      // get id of image in DB
      const thisImage = await Image
          .findOne({isDemo: true})
          .populate('scenes', {sceneName: 1});

      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .send({
            fileName: '_DSC12345.jpg',
            scenes: sceneIDs,
          })
          .expect(200);

      // returns correct metadata
      expect(response.body.fileName).toEqual('_DSC12345.jpg');

      const returnedSceneIDs = response.body.scenes.map((i) => i.id);
      expect(returnedSceneIDs).toMatchObject(sceneIDs);

      // correct metadata in DB
      const metadataDB = await Image.findById(imageID);
      expect(metadataDB.fileName).toEqual('_DSC12345.jpg');

      const sceneIDsDB = metadataDB.scenes.map((i) => i.toString());
      expect(sceneIDsDB).toMatchObject(sceneIDs);

      // no changes to default images
      const defaultImagesEnd = await Image.find({isDemo: false});
      expect(defaultImagesStart).toStrictEqual(defaultImagesEnd);
    });


    test('scene DELETE', async () => {
      const defaultScenesStart = await Scene.find({isDemo: false});
      // get id of scene in DB
      const thisScene = await Scene.findOne({isDemo: true});
      const sceneID = thisScene._id.toString();

      await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(204);

      // entry removed from DB
      const updatedEntry = await Scene.findById(sceneID);
      expect(updatedEntry).toEqual(null);

      // no changes to default scenes
      const defaultScenesEnd = await Scene.find({isDemo: false});
      expect(defaultScenesStart).toStrictEqual(defaultScenesEnd);
    });
  });

  describe('file deletion', () => {
    // upload files to delete
    beforeAll(async () => {
      // images
      await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload',
              `${imageSourcePath}/${imageToDelete}`,
              {contentType: 'multipart/form-data'});

      // audio
      await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload',
              `${audioSourcePath}/${audioToDelete}`,
              {contentType: 'multipart/form-data'});
    });

    test('image DELETE', async () => {
      const defaultImagesStart = await Image.find({isDemo: false});

      // need the id of the entry to delete
      const imageData = await Image.findOne({fileName: imageToDelete});
      const thisID = imageData._id.toString();

      await api
          .delete(`/api/image-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(204);

      // verify that the image data is removed from the DB
      const newImageData = await Image.find({fileName: imageToDelete});
      expect(newImageData).toEqual([]);

      // verify that the image file is removed from the server
      const isFile = fs.statSync(`${imageDestinationPath}/${imageToDelete}`,
          {throwIfNoEntry: false});

      expect(isFile).toBeUndefined();

      // no changes to default images
      const defaultImagesEnd = await Image.find({isDemo: false});
      expect(defaultImagesStart).toStrictEqual(defaultImagesEnd);
    });

    test('audio DELETE', async () => {
      const defaultAudioStart = await Audio.find({isDemo: false});

      // id of audio file to delete
      const audioData = await Audio.findOne({fileName: audioToDelete});
      const thisID = audioData._id.toString();

      await api
          .delete(`/api/audio-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(204);

      // data removed from DB
      const newAudioData = await Audio.find({fileName: audioToDelete});
      expect(newAudioData).toEqual([]);

      // file removed from server
      const isFile = fs.statSync(`${audioDestinationPath}/${audioToDelete}`,
          {throwIfNoEntry: false});

      expect(isFile).toBeUndefined();

      // no changes to default audio
      const defaultAudioEnd = await Audio.find({isDemo: false});
      expect(defaultAudioStart).toStrictEqual(defaultAudioEnd);
    });
  });
});

describe('demo token cannot authenticate default requests ...', () => {
  describe('with refer set to /demo', () => {
    // uploads aren't included here bc demo token + /demo referer still work,
    // with the file being uploaded to the demo view automatically
    // (same idea for scene PUT, which saves to the DB based on the referer)
    // the above tests check that this doesn't make changes to default content
    test('image DELETE', async () => {
      // need the id of the entry to delete
      const imageData = await Image.findOne({isDemo: false});
      const thisID = imageData._id.toString();

      const response = await api
          .delete(`/api/image-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(403);

      expect(response.body.error)
          .toEqual('demo users cannot delete default content');
    });

    test('audio DELETE', async () => {
      // need the id of the entry to delete
      const audioData = await Audio.findOne({isDemo: false});
      const thisID = audioData._id.toString();

      const response = await api
          .delete(`/api/audio-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(403);

      expect(response.body.error)
          .toEqual('demo users cannot delete default content');
    });

    test('image PUT', async () => {
      // get id of image in DB
      const thisImage = await Image
          .findOne({isDemo: false})
          .populate('scenes', {sceneName: 1});

      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .send({
            fileName: '_DSC12345.jpg',
            scenes: sceneIDs,
          })
          .expect(403);

      expect(response.body.error)
          .toEqual('demo users cannot change default content');
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({isDemo: false});
      const sceneID = thisScene._id.toString();

      const response = await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .expect(403);

      expect(response.body.error)
          .toEqual('demo users cannot change default scenes');
    });
  });

  describe('by setting referer to /', () => {
    test('image upload', async () => {
      const response = await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${imageUploadFile}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('image DELETE', async () => {
      // need the id of the entry to delete
      const imageData = await Image.findOne({isDemo: false});
      const thisID = imageData._id.toString();

      const response = await api
          .delete(`/api/image-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('image PUT', async () => {
      // get id of image in DB
      const thisImage = await Image
          .findOne({isDemo: false})
          .populate('scenes', {sceneName: 1});

      const imageID = thisImage._id.toString();
      const sceneIDs = thisImage.scenes.map((i) => i._id.toString());

      const response = await api
          .put(`/api/image-data/${imageID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .send({
            fileName: '_DSC12345.jpg',
            scenes: sceneIDs,
          })
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('audio upload', async () => {
      const response = await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${audioSourcePath}/${audioUploadFile}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('audio DELETE', async () => {
      // need the id of the entry to delete
      const audioData = await Audio.findOne({isDemo: false});
      const thisID = audioData._id.toString();

      const response = await api
          .delete(`/api/audio-data/${thisID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('scene POST', async () => {
      const sceneName = 'scene-5';
      const response = await api
          .post('/api/scenes')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .send({sceneName})
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });

    test('scene DELETE', async () => {
      // get id of scene in DB
      const thisScene = await Scene.findOne({isDemo: false});
      const sceneID = thisScene._id.toString();

      const response = await api
          .delete(`/api/scenes/${sceneID}`)
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/')
          .expect(400);

      expect(response.body.error).toEqual('invalid signature');
    });
  });
});

describe('cannot upload same file to default and demo', () => {
  describe('images', () => {
    const duplicateFile = demoImages[2];
    const duplicateAudio = demoAudio[1];

    // make sure duplicate file isn't already in there
    beforeEach(async () => {
      // image file
      try {
        fs.unlinkSync(`${imageDestinationPath}/${duplicateFile}`);
        console.log(`${duplicateFile} removed from ${imageDestinationPath}`);
      } catch (ENOENT) {
        console.log(`${duplicateFile} not in ${imageDestinationPath}`);
      }

      // audio file
      try {
        fs.unlinkSync(`${audioDestinationPath}/${duplicateAudio}`);
        console.log(`${duplicateAudio} removed from ${audioDestinationPath}`);
      } catch (ENOENT) {
        console.log(`${duplicateAudio} not in ${audioDestinationPath}`);
      }

      // image metadata
      const thisImage = await Image.findOne({fileName: duplicateFile});
      if (thisImage) {
        await Image.findByIdAndDelete(thisImage.id);
      }

      // audio metadata
      const thisAudio = await Audio.findOne({fileName: duplicateAudio});
      if (thisAudio) {
        await Audio.findByIdAndDelete(thisAudio.id);
      };
    });

    test('default then demo (images)', async () => {
      // upload to default
      await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${adminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${duplicateFile}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // then try to upload to demo
      const response = await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${duplicateFile}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toContain('expected `fileName` to be unique');
    });

    test('demo then default (images)', async () => {
      // upload to demo
      await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${duplicateFile}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // then try to upload to default
      const response = await api
          .post('/api/admin/upload/images')
          .set('Authorization', `Bearer ${adminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${imageSourcePath}/${duplicateFile}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toContain('expected `fileName` to be unique');
    });

    test('default then demo (audio)', async () => {
      // upload to default
      await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${adminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${audioSourcePath}/${duplicateAudio}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // then try to upload to demo
      const response = await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${audioSourcePath}/${duplicateAudio}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toContain('expected `fileName` to be unique');
    });

    test('demo then default (audio)', async () => {
      // upload to demo
      await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${demoAdminToken}`)
          .set('referer', '/demo')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${audioSourcePath}/${duplicateAudio}`,
              {contentType: 'multipart/form-data'})
          .expect(200);

      // then try to upload to default
      const response = await api
          .post('/api/admin/upload/audio')
          .set('Authorization', `Bearer ${adminToken}`)
          .set('referer', '/')
          .attach(
              'adminUpload', // this is the key multer is expecting
              `${audioSourcePath}/${duplicateAudio}`,
              {contentType: 'multipart/form-data'})
          .expect(400);

      expect(response.body.error).toContain('expected `fileName` to be unique');
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
