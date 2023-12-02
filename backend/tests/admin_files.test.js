// WARNING: this can remove items from ../media,
// so maybe don't run in the production environment

const mongoose = require('mongoose');
const supertest = require('supertest');
const fs = require('fs');
const app = require('../app');
const api = supertest(app);
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');

// CRITICAL: paths are from WHERE THE TESTS ARE RUN
// (i.e. /backend), not the test directory
const imageDestinationPath = './media/images';
const imageSourcePath = './media_testing/images';

const imageUploadFile = '_DSC2591.jpg';

let adminToken;

// login function to get admin token
const getAdminToken = async () => {
  const adminCredentials = {username: 'test.admin', password: 'example'};
  const response = await api
      .post('/api/login')
      .send(adminCredentials);
  return response.body.adminToken;
};

// make sure the test documents to upload are not already in ../media
beforeAll(async () => {
  // set the admin token
  adminToken = await getAdminToken();

  // clear the DB of image and audio metadata
  await Audio.deleteMany({});
  await Image.deleteMany({});

  // remove the target files from ./media (if they're there)
  try {
    fs.unlinkSync(`${imageDestinationPath}/${imageUploadFile}`);
    console.log(`${imageUploadFile} removed from ${imageDestinationPath}`);
  } catch (ENOENT) {
    console.log(`${imageUploadFile} not in ${imageDestinationPath}`);
  };
});

describe('upload ...', () => {
  test.only('image', async () => {
    const response = await api
        .post('/api/admin/upload/images')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach(
            'adminUpload',
            `${imageSourcePath}/${imageUploadFile}`,
            {contentType: 'multipart/form-data'})
        .expect(200);

    // confirm that the returned metadata is correct
    expect(response.body.fileName).toEqual(imageUploadFile);

    // confirm that the file itself is there
    const isFile = fs.statSync(`${imageDestinationPath}/${imageUploadFile}`,
        {throwIfNoEntry: false});

    expect(isFile).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
