const jwt = require('jsonwebtoken');
const {SECRET_ENTER, SECRET_ENTER_DEMO} = require('../utils/config');
const logger = require('./logger');

// adds token to request data
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
  const isDemo = request.isDemo;
  // 'entry-demo' creation uses different secret
  const entrySecret = isDemo ? SECRET_ENTER_DEMO : SECRET_ENTER;

  if (token) {
    const isAuthorized = jwt.verify(token, entrySecret).id;

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
  let isDemo = false; // default --> handle requests as normal

  // only run if the referer is given (it's not on page loads)
  if (request.headers.referer) {
    const referer = request.headers.referer;
    // only set to demo if referer includes 'demo'
    isDemo = referer.includes('demo');

    // entry authentication
    if (isDemo && request.body.username === 'entry') {
      request.body.username = 'entry-demo';
    };
  }

  // general change --> add isDemo to request body
  request.isDemo = isDemo;

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
