require('dotenv').config()

const PORT = process.env.PORT
const TOKEN = process.env.TOKEN
const RANDY_HASH = process.env.RANDY_HASH

const NODE_ENV = process.env.NODE_ENV

const mongourl = NODE_ENV === 'development'
    ? process.env.DEV_MONGODB_URI
    : 'only dev DB set'



module.exports = {mongourl, PORT, TOKEN, RANDY_HASH, NODE_ENV}