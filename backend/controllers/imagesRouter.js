const imagesRouter = require('express').Router()
const fs = require('fs')
const Image = require('../models/imageModel')

const imagePath = './media/images'

//getting all the image data (now requires ENTRY authentication)
imagesRouter.get('/', async (request, response) => {
  const entryTokenFound = request.user //all done in the custon MW

  if (!entryTokenFound) {
    return response.status(401).json({ error: 'valid token required' })
  }

  const imageData = await Image.find({}).populate('scenes', {sceneName : 1})

  if(imageData) {
      response.json(imageData)
    } else {
      response.status(404).end()
    }
})

//delete a single image
imagesRouter.delete('/:id', async (request, response, next) => {
  //token bit
  if (!request.user) {
    return response.status(401).json({ error: 'valid token required' })
  }
  
  //regular bits
  const thisID = request.params.id
  const image = await Image.findById(thisID)

  //something goes wrong
  if (!image) {
    return response.status(404).json({ error: 'requested image not found' })
  }
  
  const thisFile = image.fileName

  await Image.findByIdAndRemove(thisID)
  try {
    fs.unlinkSync(`${imagePath}/${thisFile}`)
    console.log(`file deleted from server: ${thisFile}`)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

//tagging images as specific scenes
//NOTE: this can handle any kind of update, so need to pass EVERY property of the image, not just scene
imagesRouter.put('/:id', async (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ error: 'valid token required' })
  }

  const thisID = request.params.id
  const body = request.body
  const updates = {fileName : body.fileName, time : body.time, scenes : body.scenes, people : body.people}

  const savedUpdates = await Image.findByIdAndUpdate(thisID, updates, {new: true})

  await savedUpdates.populate('scenes', {sceneName : 1})

  response.json(savedUpdates)

  next()

})

module.exports = imagesRouter