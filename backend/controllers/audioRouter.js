const audioRouter = require('express').Router()
const Audio = require('../models/audioModel')

//getting all the audio data
audioRouter.get('/', async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'valid token required' })
    }

    const audioData = await Audio.find({})

    if (audioData) {
        response.json(audioData)
    } else {
        response.status(404).end()
    }

})

module.exports = audioRouter