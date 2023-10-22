const jwt = require('jsonwebtoken')
const { SECRET_ENTER } = require('../utils/config')
const logger = require('./logger')

//for use with blog router
const userExtractor = (request, response, next) => {

    const authorization = request.get('authorization')

    
    if (authorization && authorization.startsWith('Bearer ')) { //watch out! at places in fullstack its "bearer" in lowercase
        const token = authorization.replace('Bearer ', '')

        request.token = token

        //note: removed the jwt.verify(...) check from the MW because we now need to verify with different SECRETs for different routes

          
    }
    
    next()

}

//authorization for static images (entry token passed as variable in query)
//idk if this is less secure then passing the entry token in the header, but there doesn't seem to be
//any quick way to do that with the <img> element
const staticAuthorization = (request, response, next) => {
    const token = request.query.token
    
    if (token) {
        const isAuthorized = jwt.verify(token, SECRET_ENTER).id

        if (!isAuthorized) {
            return response.status(401).json({ error: 'entry token invalid' })
        }

    } else {
        return response.status(401).json({ error: 'entry token required' })
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

module.exports = {errorHandler, userExtractor, staticAuthorization}