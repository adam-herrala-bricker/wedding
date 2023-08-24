require('dotenv').config()

const PORT = process.env.PORT
const TOKEN = process.env.TOKEN
const RANDY_HASH = process.env.RANDY_HASH

const ADMIN_KEY = process.env.ADMIN_KEY

const NODE_ENV = process.env.NODE_ENV

const mongourl = NODE_ENV === 'development'
    ? process.env.DEV_MONGODB_URI
    : 'only dev DB set'



module.exports = {mongourl, ADMIN_KEY, PORT, TOKEN, RANDY_HASH, NODE_ENV}