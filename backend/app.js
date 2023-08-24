const {mongourl} = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')
const uploadRouter = require('./controllers/uploadRouter')
const middleware = require('./utils/middleware')
const morgan = require('morgan')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', mongourl)

mongoose.connect(mongourl)
    .then(() => {
        logger.info('connected to MongoDB!')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB: error.message')
    })

app.use(cors())
app.use(express.json())
//using this to serve static png files
app.use('/api/images', express.static('media/images')) //virtual path to images folder
/* would put connection to static FE and custom middleware here too, e.g.:
app.use(express.static('build))
app.use(middleWare.requestLogger)
*/

//morgan for outputting requests to consol
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


//custom middleware for extracting user info for authentication
app.use(middleware.userExtractor)

//routers
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/admin/upload', uploadRouter)

app.use(middleware.errorHandler)


module.exports = app