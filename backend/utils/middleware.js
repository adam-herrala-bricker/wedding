const jwt = require('jsonwebtoken');
const {SECRET_ENTER} = require('../utils/config');
const logger = require('./logger');

// for use with blog router
const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    request.token = token;
  }
  next();
};

// authorization for static images (entry token passed as variable in query)
// idk if this is less secure then passing the entry token in the header
// but there doesn't seem to be any quick way to do that with the <img> element
const staticAuthorization = (request, response, next) => {
  const token = request.query.token;

  if (token) {
    const isAuthorized = jwt.verify(token, SECRET_ENTER).id;

    if (!isAuthorized) {
      return response.status(401).json({error: 'entry token invalid'});
    }
  } else {
    return response.status(401).json({error: 'entry token required'});
  }

  next();
};

// manipulates requests + responses to just see demo content
// markeds as isDemo: true in DB
const demoHandler = (request, response, next) => {
  // only run if the referer is given
  if (request.headers.referer) {
    const referer = request.headers.referer;
    const isDemo = referer.includes('demo');
    console.log(referer, true);

    // entry authentication
    if (isDemo && request.body.username === 'entry') {
      request.body.username = 'entry-demo';
    };

    console.log(request.body);
  }

  next();
};

// something's going on here; figure out
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message});
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({error: error.message});
  }

  next(error);
};

module.exports = {
  errorHandler,
  userExtractor,
  staticAuthorization,
  demoHandler,
};
