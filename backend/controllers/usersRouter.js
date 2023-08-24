const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/userModel')
const {ADMIN_KEY} = require('../utils/config')

//POST request for creating a new user

usersRouter.post('/', async (request, response, next) => {
    const {username, displayname, password, email, isAdmin, adminKey} = request.body

    if (!password) {
        response.status(400).json({error: 'password required'})
    } else if (password.length < 3) {
        response.status(400).json({error: 'password must be at least 3 characters long!'})
    } else if (isAdmin & adminKey !== ADMIN_KEY) {
        response.status(400).json({error: 'vaild admin key required for admin status'})
    } else {
            //mystery juice
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const adminHash = isAdmin
            ? await bcrypt.hash(adminKey, saltRounds) //only create adminHash for admin
            : ''

        const user = new User({
            username,
            displayname,
            email,
            passwordHash,
            isAdmin,
            adminHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    }
    
    next()
    
})


//unclear if there's any use for a get request for all user data, but that would go here

module.exports = usersRouter