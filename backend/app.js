const {mongourl} = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/usersRouter');
const loginRouter = require('./controllers/loginRouter');
const uploadRouter = require('./controllers/uploadRouter');
const imagesRouter = require('./controllers/imagesRouter');
const audioRouter = require('./controllers/audioRouter');
const sceneRouter = require('./controllers/sceneRouter');
const healthRouter = require('./controllers/healthRouter');
const entryCheckRouter = require('./controllers/entryCheckRouter');
const middleware = require('./utils/middleware');
const morgan = require('morgan');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const {NODE_ENV} = require('./utils/config');

mongoose.set('strictQuery', false);

logger.info('connecting to', mongourl);

mongoose.connect(mongourl)
    .then(() => {
      logger.info('connected to MongoDB!');
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB: error.message');
    });

app.use(cors());
app.use(express.json());
// MW to change requests based on referer (/ or /demo)
app.use(middleware.demoHandler);
// using this to serve static files with authorization middleware
app.use('/api/images', middleware.staticAuthorization);
app.use('/api/audio', middleware.staticAuthorization);
// virtual path to images and audio folders
app.use('/api/images', express.static('media/images'));
app.use('/api/audio', express.static('media/audio'));
// connection to static FE (not moving it to backend)
app.use(express.static('../frontend/build'));
// endpoint for demo version of page
// same build, MW handles servering different content
app.use('/demo', express.static('../frontend/build'));

// morgan for outputting requests to console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); // eslint-disable-line max-len


// custom middleware for extracting user info for authentication
app.use(middleware.userExtractor);

// routers
app.use('/api/health', healthRouter);
app.use('/api/entry-check', entryCheckRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/admin/upload', uploadRouter);
app.use('/api/image-data', imagesRouter);
app.use('/api/audio-data', audioRouter);
app.use('/api/scenes', sceneRouter);

if (NODE_ENV === 'testing') {
  const testingRouter = require('./controllers/testingRouter');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);


module.exports = app;
