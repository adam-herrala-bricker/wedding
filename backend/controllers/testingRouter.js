// eslint-disable-next-line new-cap
const testingRouter = require('express').Router();
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');

// removes everything from the DB
// for TESTING ONLY
testingRouter.post('/reset', async (request, response) => {
  await Audio.deleteMany({});
  await Image.deleteMany({});
  await Scene.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
