const imagesRouter = require('express').Router()
const Image = require('../models/imageModel')

//getting all the image data (doesn't require user authentication)
imagesRouter.get('/', async (request, response) => {
    const imageData = await Image.find({})

    if(imageData) {
        response.json(imageData)
      } else {
        response.status(404).end()
      }
})

module.exports = imagesRouter

//posting on images will eventually go here