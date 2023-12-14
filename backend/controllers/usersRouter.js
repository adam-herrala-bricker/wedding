const bcrypt = require('bcrypt');
const usersRouter = require('express').Router(); // eslint-disable-line new-cap
const User = require('../models/userModel');
const {ADMIN_KEY, ADMIN_KEY_DEMO} = require('../utils/config');

// POST request for creating a new user
usersRouter.post('/', async (request, response, next) => {
  const {
    username,
    displayname,
    password,
    email,
    isAdmin,
    adminKey,
    isDemo,
  } = request.body;

  if (!password) {
    response.status(400).json({error: 'password required'});
  } else if (password.length < 3) {
    response.status(400).json({error: 'password must be at least 3 characters long!'}); // eslint-disable-line max-len
  } else if (isAdmin & adminKey !== ADMIN_KEY & adminKey !== ADMIN_KEY_DEMO) {
    response.status(400).json({error: 'vaild admin key required for admin status'}); // eslint-disable-line max-len
  } else {
    // mystery juice
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // only create adminHash for admin
    const adminHash = isAdmin ? await bcrypt.hash(adminKey, saltRounds) : '';

    const user = new User({
      username,
      displayname,
      email,
      passwordHash,
      isAdmin,
      adminHash,
      isDemo,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  }

  next();
});

module.exports = usersRouter;
