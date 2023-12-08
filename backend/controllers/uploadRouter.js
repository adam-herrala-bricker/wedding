// NOTE: the audio and image uploads have very similar structures
// on refactor, see if they can't be merged into a single one

const uploadRouter = require('express').Router(); // eslint-disable-line new-cap
const jwt = require('jsonwebtoken');
const Image = require('../models/imageModel');
const Audio = require('../models/audioModel');
const {SECRET_ADMIN, sceneAllID} = require('../utils/config');

// middleware for handling multipart form data (aka files)
const multer = require('multer');

// so we can have the file extensions on all the file names
const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './media/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './media/audio');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadImages = multer({storage: storageImage});
const uploadAudio = multer({storage: storageAudio});

// authentication function for multer (requires ADMIN token)
const authorizeUser = (request, response, next) => {
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN).id;
  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid token required'});
  }

  next();
};

// FINALLY the actual router for uploading images
uploadRouter.post(
    '/images',
    uploadImages.single('adminUpload'),
    authorizeUser, async (request, response, next) => {
    // saves the metadata to the DB
      const fileName = request.file.filename;
      const isDemo = request.isDemo;

      // ID for scene all moved to .env

      // image DB
      const imageMetadata = new Image({
        fileName: fileName,
        scenes: [sceneAllID],
        isDemo: isDemo,
      });
      const savedMetadata = await imageMetadata.save();
      await savedMetadata.populate('scenes', {sceneName: 1, id: 1});

      response.status(200).json(savedMetadata);

      next();
    });

// router for uploading audio
uploadRouter.post(
    '/audio',
    uploadAudio.single('adminUpload'),
    authorizeUser, async (request, response, next) => {
      const isDemo = request.isDemo;
      // save metadata to audio DB
      const fileName = request.file.filename;
      const audioMetadata = new Audio({fileName, isDemo});
      await audioMetadata.save();

      response.status(200).json(audioMetadata);
      next();
    });


module.exports = uploadRouter;
