const healthRouter = require('express').Router(); // eslint-disable-line new-cap
const fs = require('fs');
const Audio = require('../models/audioModel');
const Image = require('../models/imageModel');
const Scene = require('../models/sceneModel');
const User = require('../models/userModel');

// returns 200 + number of items on server and DB
healthRouter.get('/', async (request, response) => {
  // able to connect to database
  const audioEntries = await Audio.find({});
  const imageEntries = await Image.find({});
  const sceneEntries = await Scene.find({});
  const userEntries = await User.find({});

  // media files on server
  const audioFiles = fs
      .readdirSync('./media/audio')
      .filter((i) => i.includes('mp3'));

  const imageFilesFullRes = fs
      .readdirSync('./media/images')
      .filter((i) => i.includes('jpg'));

  const imageFilesWebRes = fs
      .readdirSync('./media/images/web-res')
      .filter((i) => i.includes('jpg'));

  return response
      .status(200)
      .json({
        health: 'ok',
        audioFilesOnServer: audioFiles.length,
        fullResImageFilesOnServer: imageFilesFullRes.length,
        webResImageFilesOnServer: imageFilesWebRes.length,
        audioEntriesInDB: audioEntries.length,
        imageEntriesInDB: imageEntries.length,
        scenesInDB: sceneEntries.length,
        usersInDB: userEntries.length,
      });
});

module.exports = healthRouter;
