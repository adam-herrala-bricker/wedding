const imagesRouter = require('express').Router(); // eslint-disable-line new-cap
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Image = require('../models/imageModel');
const {SECRET_ADMIN, SECRET_ENTER} = require('../utils/config');

const imagePath = './media/images';

// getting all the image data (requires ENTRY authentication)
imagesRouter.get('/', async (request, response) => {
  // token bit
  const entryTokenFound = jwt.verify(request.token, SECRET_ENTER).id;

  if (!entryTokenFound) {
    return response.status(401).json({error: 'valid entry token required'});
  }

  const imageData = await Image.find({}).populate('scenes', {sceneName: 1});

  if (imageData) {
    response.json(imageData);
  } else {
    response.status(404).end();
  }
});

// delete a single image (requires ADMIN authentication)
imagesRouter.delete('/:id', async (request, response, next) => {
  // token bit
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN).id;
  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid admin token required'});
  }

  // regular bits
  const thisID = request.params.id;
  const image = await Image.findById(thisID);

  // something goes wrong
  if (!image) {
    return response.status(404).json({error: 'requested image not found'});
  }

  const thisFile = image.fileName;

  // remove from image DB
  await Image.findByIdAndRemove(thisID);


  // remove from server
  try {
    fs.unlinkSync(`${imagePath}/${thisFile}`);
    console.log(`file deleted from server: ${thisFile}`);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// tagging images as specific scenes (requires ADMIN token)
// NOTE: this can handle any kind of update,
// so need to pass EVERY property of the image, not just scene
imagesRouter.put('/:id', async (request, response, next) => {
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN).id;

  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid token required'});
  }

  const thisID = request.params.id;
  const body = request.body;
  const updates = {fileName: body.fileName,
    time: body.time, scenes: body.scenes,
    people: body.people};

  const savedUpdates = await Image.findByIdAndUpdate(thisID, updates, {new: true}); // eslint-disable-line max-len

  await savedUpdates.populate('scenes', {sceneName: 1});

  response.json(savedUpdates);

  next();
});

module.exports = imagesRouter;
