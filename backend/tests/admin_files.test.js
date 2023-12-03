// WARNING: this can remove items from ../media,
// so maybe don't run in the production environment

// Also, many of these tests are order-dependent,
// so test.only() may not work as expected

const mongoose = require('mongoose');
const supertest = require('supertest');
const fs = require('fs');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const User = require('../models/userModel');
const {ENTRY_KEY} = require('../utils/config');
const {
  entryUserCredentials,
  getAdminUserCredentials,
  imageDestinationPath,
  imageSourcePath,
  audioDestinationPath,
  audioSourcePath,
  imageUploadFile,
  audioUploadFile,
  fakeID,
} = require('../utils/test_constants');

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

// make sure the test documents to upload are not already in ../media
beforeAll(async () => {
  // clear the DB of image and audio metadata
  await Audio.deleteMany({});
  await Image.deleteMany({});

  // clear DB of users
  await User.deleteMany({});

  // add entry 'user'
  const entryUser = new User(entryUserCredentials);
  await entryUser.save();

  // add admin user
  const adminUserCredentials = await getAdminUserCredentials();
  const adminUser = new User(adminUserCredentials);
  await adminUser.save();

  // set the admin token
  adminToken = await getAdminToken();
  entryToken = await getEntryToken();

  // remove the target files from ./media (if they're there)
  console.log('prior to testing ...');

  try {
    fs.unlinkSync(`${imageDestinationPath}/${imageUploadFile}`);
    console.log(`${imageUploadFile} removed from ${imageDestinationPath}`);
  } catch (ENOENT) {
    console.log(`${imageUploadFile} not in ${imageDestinationPath}`);
  }

  try {
    fs.unlinkSync(`${audioDestinationPath}/${audioUploadFile}`);
    console.log(`${audioUploadFile} removed from ${audioDestinationPath}`);
  } catch (ENOENT) {
    console.log(`${audioUploadFile} not in ${audioDestinationPath}`);
  }
}, 10000);

describe('uploading fails without authorization', () => {
  test('image upload', async () => {
    const response = await api
        .post('/api/admin/upload/images')
        .attach(
            'adminUpload', // this is the key multer is expecting
            `${imageSourcePath}/${imageUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toEqual('jwt must be provided');
  });

  test('audio upload', async () => {
    const response = await api
        .post('/api/admin/upload/audio')
        .attach(
            'adminUpload',
            `${audioSourcePath}/${audioUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toEqual('jwt must be provided');
  });
});

describe('uploading fails if invalid (i.e. entry) token provided', () => {
  test('image upload', async () => {
    const response = await api
        .post('/api/admin/upload/images')
        .set('Authorization', `Bearer ${entryToken}`)
        .attach(
            'adminUpload', // this is the key multer is expecting
            `${imageSourcePath}/${imageUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toEqual('invalid signature');
  });

  test('audio upload', async () => {
    const response = await api
        .post('/api/admin/upload/audio')
        .set('Authorization', `Bearer ${entryToken}`)
        .attach(
            'adminUpload',
            `${audioSourcePath}/${audioUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toEqual('invalid signature');
  });
});

describe('successful uploading for ...', () => {
  test('a single image', async () => {
    const response = await api
        .post('/api/admin/upload/images')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach(
            'adminUpload', // this is the key multer is expecting
            `${imageSourcePath}/${imageUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(200);

    // confirm that the returned metadata is correct
    expect(response.body.fileName).toEqual(imageUploadFile);

    // confirm that the returned metadata is in the DB
    const metadataDB = await Image.findById(response.body.id);
    expect(metadataDB.fileName).toEqual(imageUploadFile);

    // confirm that the file itself is there (returns undefined if not)
    const isFile = fs.statSync(`${imageDestinationPath}/${imageUploadFile}`,
        {throwIfNoEntry: false});

    expect(isFile).toBeDefined();
  });

  test('a single audio file', async () => {
    const response = await api
        .post('/api/admin/upload/audio')
        .set('Authorization', `Bearer ${adminToken}`)
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
  });
});

// note: this block assumes the successful upload block has already run
describe('duplicate uploading fails', () => {
  test('image upload', async () => {
    const response = await api
        .post('/api/admin/upload/images')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach(
            'adminUpload', // this is the key multer is expecting
            `${imageSourcePath}/${imageUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toContain('expected `fileName` to be unique');
  });

  test('audio upload', async () => {
    const response = await api
        .post('/api/admin/upload/audio')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach(
            'adminUpload',
            `${audioSourcePath}/${audioUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(400);

    expect(response.body.error).toContain('expected `fileName` to be unique');
  });
});

// note: this must run AFTER the successful upload block
// but BEFORE the sucessful deletion block
describe('delete request fails without authorization', () => {
  test('image delete', async () => {
    // id of entry to delete
    const imageData = await Image.findOne({fileName: imageUploadFile});
    const thisID = imageData._id.toString();

    const response = await api
        .delete(`/api/image-data/${thisID}`)
        .expect(400);

    expect(response.body.error).toEqual('jwt must be provided');
  });

  test('audio delete', async () => {
    // id of entry to delete
    const audioData = await Audio.findOne({fileName: audioUploadFile});
    const thisID = audioData._id.toString();

    const response = await api
        .delete(`/api/audio-data/${thisID}`)
        .expect(400);

    expect(response.body.error).toEqual('jwt must be provided');
  });
});

// note: this too must run AFTER the successful upload block
// but BEFORE the successful deletion block
describe('delete request fails if invalid (i.e. entry) token provided', () => {
  test('image delete', async () => {
    // id of the entry to delete
    const imageData = await Image.findOne({fileName: imageUploadFile});
    const thisID = imageData._id.toString();

    response = await api
        .delete(`/api/image-data/${thisID}`)
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(400);

    expect(response.body.error).toEqual('invalid signature');
  });

  test('audio delete', async () => {
    // get id of entry to delete
    const audioData = await Audio.findOne({fileName: audioUploadFile});
    const thisID = audioData._id.toString();

    const response = await api
        .delete(`/api/audio-data/${thisID}`)
        .set('Authorization', `Bearer ${entryToken}`)
        .expect(400);

    expect(response.body.error).toEqual('invalid signature');
  });
});

// note: this block also assumes that the successful upload block has run first
describe('successful deletion', () => {
  test('image delete', async () => {
    // need the id of the entry to delete
    const imageData = await Image.findOne({fileName: imageUploadFile});
    const thisID = imageData._id.toString();

    await api
        .delete(`/api/image-data/${thisID}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

    // verify that the image data is removed from the DB
    const newImageData = await Image.find({fileName: imageUploadFile});
    expect(newImageData).toEqual([]);

    // verify that the image file is removed from the server
    const isFile = fs.statSync(`${imageDestinationPath}/${imageUploadFile}`,
        {throwIfNoEntry: false});

    expect(isFile).toBeUndefined();
  });

  test('audio delete', async () => {
    // get id of entry to delete
    const audioData = await Audio.findOne({fileName: audioUploadFile});
    const thisID = audioData._id.toString();

    await api
        .delete(`/api/audio-data/${thisID}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

    // verify that the audio data is removed from the DB
    const newAudioData = await Audio.find({fileName: audioUploadFile});
    expect(newAudioData).toEqual([]);

    // verify that the audio file is removed from the server
    const isFile = fs.statSync(`${audioDestinationPath}/${audioUploadFile}`,
        {throwIfNoEntry: false});

    expect(isFile).toBeUndefined();
  });
});

describe('delete request with unfound id --> 404', () => {
  test('image delete request', async () => {
    response = await api
        .delete(`/api/image-data/${fakeID}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

    expect(response.body.error).toEqual('requested image not found');
  });

  test('audio delete request', async () => {
    response = await api
        .delete(`/api/audio-data/${fakeID}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

    expect(response.body.error).toEqual('requested audio not found');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
