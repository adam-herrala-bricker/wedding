const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/userModel')
const {ADMIN_KEY, SECRET_USER, SECRET_ADMIN, SECRET_ENTER} = require('../utils/config')

//POST request to login
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({error: 'invalid username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    //different tokens for user vs. 'entry' pseudo-user
    const token = user.username === 'entry' 
        ? jwt.sign(userForToken, SECRET_ENTER)
        : jwt.sign(userForToken, SECRET_USER)

    //additional steps for admin token if user is admin:
    //1. checks to make sure that the admin key is correct
    const adminCorrect = !user.isAdmin
        ? false
        : await bcrypt.compare(ADMIN_KEY, user.adminHash)

    //2. gives seperate admin token
    const adminToken = adminCorrect
        ? jwt.sign(userForToken, SECRET_ADMIN)
        : null

    response.status(200).send({ token, adminToken, isAdmin: user.isAdmin, username: user.username, displayname: user.displayname})

})

//POST request to enter page

module.exports = loginRouter