const sceneRouter = require('express').Router()
const Scene = require('../models/sceneModel')
const Image = require('../models/imageModel')

//creating new scene (requires ADMIN token)
sceneRouter.post('/', async (request, response, next) => {
    const {sceneName} = request.body
   
    if (!request.user) {
        return response.status(401).json({ error: 'valid token required' })
    }

    const scene = new Scene({
        sceneName
    })

    const savedScene = await scene.save()

    await savedScene.populate('images', {fileName : 1})

    response.status(201).json(savedScene)

    next()

})

//getting all scenes (requires ENTRY token)
sceneRouter.get('/', async (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({ error: 'valid token required' })
      }
    
    const sceneData = await Scene.find({}).populate('images', {fileName : 1})
    
    if(sceneData) {
        response.json(sceneData)
    } else {
        response.status(404).end()
    }

    next()
})


//adding/removing new image to scene
//this is accomplished by passing the ENTIRE NEW list of images (by id) in the scene
//logic for adding or removing is done on the FE
sceneRouter.put('/:id', async (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({ error: 'valid token required' })
      }

    const thisID = request.params.id
    const body = request.body
    const updates = {images: body.imageIDs}
    
    //update scenes in DB
    const savedUpdates = await Scene.findByIdAndUpdate(thisID, updates, {new: true})

    await savedUpdates.populate('images', {fileName : 1})

    response.json(savedUpdates)

    next()

})

//deleting entire scene
sceneRouter.delete('/:id', async (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({ error: 'valid token required' })
      }
    
    const thisID = request.params.id

    //scene isn't there
    const scene = await Scene.findById(thisID)
    if (!scene) {
        return response.status(404).json({error : 'scene not found'})
    }

    await Scene.findByIdAndDelete(thisID)

    response.status(204).end()

    next()

})

module.exports = sceneRouter