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

  const imageData = await Image.find({})

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

//posting on images will eventually go here

module.exports = imagesRouter