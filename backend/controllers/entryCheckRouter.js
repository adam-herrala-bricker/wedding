const jwt = require('jsonwebtoken');
const entryCheckRouter = require('express').Router(); // eslint-disable-line
const {SECRET_ENTER, SECRET_ENTER_DEMO} = require('../utils/config');

// POST request to check whether an entry token is good
// (this is used to keep the / page from loading, sans content and
// full of errors, when a /demo entry key is in local storage)
entryCheckRouter.post('/', async (request, response) => {
  const entrySecret= request.isDemo ? SECRET_ENTER_DEMO : SECRET_ENTER;
  const isGoodToken = jwt.verify(request.token, entrySecret).id;

  if (isGoodToken) {
    return response.status(200).end();
  };

  // under normal function won't get here bc jwt.verify can raise an error
  return response.status(403).json({error: 'entry key invalid'});
});

module.exports = entryCheckRouter;
