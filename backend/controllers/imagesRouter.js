const imagesRouter = require('express').Router()
const fs = require('fs')
const Image = require('../models/imageModel')

const imagePath = './media/images'

//getting all the image data (doesn't require user authentication)
imagesRouter.get('/', async (request, response) => {
    const imageData = await Image.find({})

    if(imageData) {
        response.json(imageData)
      } else {
        response.status(404).end()
      }
})

//delete a single image (will add admin authentication later)
imagesRouter.delete('/:id', async (request, response, next) => {
  const thisID = request.params.id
  const image = await Image.findById(thisID)

  //something goes wrong
  if (!image) {
    response.status(404).json({ error: 'requested image not found' })
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