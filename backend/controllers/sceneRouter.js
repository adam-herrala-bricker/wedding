const sceneRouter = require('express').Router(); // eslint-disable-line new-cap
const jwt = require('jsonwebtoken');
const Scene = require('../models/sceneModel');
const {SECRET_ADMIN, SECRET_USER, SECRET_ENTER} = require('../utils/config');

// creating new scene (requires ADMIN token)
sceneRouter.post('/', async (request, response, next) => {
  const isDemo = request.isDemo;
  let {sceneName} = request.body;

  // token bits
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN);

  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid admin token required'});
  }

  // avoid duplicate entries in the DB
  if (isDemo) {
    sceneName = `${sceneName}-demo`;
  }

  const scene = new Scene({
    sceneName,
    isDemo,
  });

  const savedScene = await scene.save();

  response.status(201).json(savedScene);

  next();
});

// getting all scenes (requires ENTRY token)
sceneRouter.get('/', async (request, response, next) => {
  const isDemo = request.isDemo;
  // 'entry-demo' creation uses user, not entry secret
  const entrySecret= isDemo ? SECRET_USER : SECRET_ENTER;
  const entryTokenFound = jwt.verify(request.token, entrySecret).id;

  if (!entryTokenFound) {
    return response.status(401).json({error: 'valid token required'});
  }
  const sceneData = await Scene.find({isDemo: isDemo});

  if (sceneData) {
    response.json(sceneData);
  } else {
    response.status(404).end();
  }
  next();
});

// deleting entire scene (requires ADMIN token)
sceneRouter.delete('/:id', async (request, response, next) => {
  const adminTokenFound = jwt.verify(request.token, SECRET_ADMIN).id;

  if (!adminTokenFound) {
    return response.status(401).json({error: 'valid admin required'});
  }

  const thisID = request.params.id;

  // scene isn't there
  const scene = await Scene.findById(thisID);
  if (!scene) {
    return response.status(404).json({error: 'scene not found'});
  }

  await Scene.findByIdAndDelete(thisID);

  response.status(204).end();

  next();
});

module.exports = sceneRouter;
