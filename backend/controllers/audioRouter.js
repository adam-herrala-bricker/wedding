const audioRouter = require('express').Router(); // eslint-disable-line new-cap
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Audio = require('../models/audioModel');
const {SECRET_ADMIN, SECRET_ENTER, SECRET_USER} = require('../utils/config');

const audioPath = './media/audio';

// getting all the audio data (requires ENTRY token)
audioRouter.get('/', async (request, response) => {
  const isDemo = request.isDemo;
  // 'entry-demo' creation uses user, not entry secret
  const entrySecret= isDemo ? SECRET_USER : SECRET_ENTER;

  const entryTokenFound = jwt.verify(request.token, entrySecret).id;

  if (!entryTokenFound) {
    return response.status(401).json({error: 'valid token required'});
  }

  const audioData = await Audio.find({isDemo: isDemo});

  if (audioData) {
    response.json(audioData);
  } else {
    response.status(404).end();
  }
});

// delete a single audio file (requires ADMIN token)
audioRouter.delete('/:id', async (request, response, next) => {
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN);

  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid token required'});
  }

  // DB bits
  const thisID = request.params.id;
  const audio = await Audio.findById(thisID);

  // something goes wrong
  if (!audio) {
    return response.status(404).json({error: 'requested audio not found'});
  }

  const thisFile = audio.fileName;

  // remove from DB
  await Audio.findByIdAndRemove(thisID);

  // server + file bits
  try {
    fs.unlinkSync(`${audioPath}/${thisFile}`);
    console.log(`file deleted from server: ${thisFile}`);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = audioRouter;
