require('dotenv').config()

const PORT = process.env.PORT

const TOKEN = process.env.TOKEN
const RANDY_HASH = process.env.RANDY_HASH

const SECRET_ENTER = process.env.SECRET_ENTER
const SECRET_USER = process.env.SECRET_USER
const SECRET_ADMIN = process.env.SECRET_ADMIN

const ADMIN_KEY = process.env.ADMIN_KEY

const NODE_ENV = process.env.NODE_ENV

const dbFinder = () => {
    switch (process.env.NODE_ENV) {
        case 'development':
            return process.env.DEV_MONGODB_URI
        case 'production':
            return process.env.PROD_MONGODB_URI
        case 'testing':
            return process.env.TEST_MONGODB_URI
    }
}

const mongourl = dbFinder()

const sceneAllID = process.env.SCENE_ALL_ID


/*
const mongourl = NODE_ENV === 'development'
    ? process.env.DEV_MONGODB_URI
    : 'only dev DB set'
*/


module.exports = {mongourl, sceneAllID, ADMIN_KEY, PORT, TOKEN, RANDY_HASH, NODE_ENV, SECRET_ENTER, SECRET_USER, SECRET_ADMIN}