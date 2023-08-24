const logger = require('./logger')
const jwt = require('jsonwebtoken')

//for use with blog router
const userExtractor = (request, response, next) => {

    const authorization = request.get('authorization')

    
    if (authorization && authorization.startsWith('Bearer ')) { //watch out! at places in fullstack its "bearer" in lowercase
        const token = authorization.replace('Bearer ', '')

        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {

            request.user = false

          } else {

            request.user = decodedToken

          }
    }
    
    next()

}

const errorHandler = (error, request, response, next) => { //something's going on here; figure out
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }
    
    next(error)
}

module.exports = {errorHandler, userExtractor}