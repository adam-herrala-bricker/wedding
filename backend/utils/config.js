require('dotenv').config()

const PORT = process.env.PORT

const TOKEN = process.env.TOKEN
const RANDY_HASH = process.env.RANDY_HASH

const SECRET = process.env.SECRET
const SECRET2 = process.env.SECRET2

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


/*
const mongourl = NODE_ENV === 'development'
    ? process.env.DEV_MONGODB_URI
    : 'only dev DB set'
*/


module.exports = {mongourl, ADMIN_KEY, PORT, TOKEN, RANDY_HASH, NODE_ENV, SECRET, SECRET2}