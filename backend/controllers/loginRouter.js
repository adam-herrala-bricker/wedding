const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router(); // eslint-disable-line new-cap
const User = require('../models/userModel');
const {
  ADMIN_KEY,
  ADMIN_KEY_DEMO,
  SECRET_USER,
  SECRET_ADMIN,
  SECRET_ENTER,
  SECRET_ENTER_DEMO,
  SECRET_ADMIN_DEMO,
} = require('../utils/config');

// POST request to login
loginRouter.post('/', async (request, response) => {
  const {username, password} = request.body;

  const user = await User.findOne({username});

  const passwordCorrect = user === null ?
    false :
    await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({error: 'invalid username or password'});
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // different tokens for user vs. 'entry' or 'entry-demo' pseudo-users
  const token = user.username === 'entry' ?
    jwt.sign(userForToken, SECRET_ENTER) :
      user.username === 'entry-demo' ?
      jwt.sign(userForToken, SECRET_ENTER_DEMO) :
      jwt.sign(userForToken, SECRET_USER);

  // additional steps for admin token if user is admin:
  // 1. checks to make sure that the admin key is correct
  const adminCorrect = !user.isAdmin ?
        false :
        user.isDemo ?
        await bcrypt.compare(ADMIN_KEY_DEMO, user.adminHash):
        await bcrypt.compare(ADMIN_KEY, user.adminHash);

  // 2. returns unauthorized if user's DB entry was generated
  // using an invalid admin key
  if (user.isAdmin && !adminCorrect) {
    return response
        .status(401)
        .json({error: 'invalid admin key used to create user'});
  };

  // 3. gives seperate admin token for vaild admin user
  const adminToken = adminCorrect ?
      user.isDemo ?
      jwt.sign(userForToken, SECRET_ADMIN_DEMO) :
      jwt.sign(userForToken, SECRET_ADMIN) :
    null;

  response.status(200).send({
    token,
    adminToken,
    isDemo: user.isDemo,
    isAdmin: user.isAdmin,
    username: user.username,
    displayname: user.displayname});
});

module.exports = loginRouter;
