const logger = require('./logger')

//for use with blog router
const userExtractor = (request, response, next) => {

    const authorization = request.get('authorization')

    
    if (authorization && authorization.startsWith('Bearer ')) { //watch out! at places in fullstack its "bearer" in lowercase
        const token = authorization.replace('Bearer ', '')

        request.token = token

        //note: removed the jwt.verify(...) check from the MW because we now need to verify with different SECRETs for different routes

       /*
        try {
            //entry token
            const decodedEntryToken = jwt.verify(token, process.env.SECRET_ENTER)

            if (!decodedEntryToken.id) {
                request.entry = false
            } else {
                request.entry = decodedEntryToken
            }
        
        } catch {
            //user token (don't think this is actually used for anything right now)
            const decodedUserToken = jwt.verify(token, process.env.SECRET_USER)
            if (!decodedUserToken) {
            request.user = null
            } else {
            request.user = decodedUserToken
            }
        }
        */

          
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