require('dotenv').config();

// set environmental variables
const PORT = process.env.PORT;

const TOKEN = process.env.TOKEN;
const RANDY_HASH = process.env.RANDY_HASH;

const SECRET_ENTER = process.env.SECRET_ENTER;
const SECRET_USER = process.env.SECRET_USER;
const SECRET_ADMIN = process.env.SECRET_ADMIN;

const SECRET_ENTER_DEMO = process.env.SECRET_ENTER_DEMO;
const SECRET_ADMIN_DEMO = process.env.SECRET_ADMIN_DEMO;

const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_KEY_DEMO = process.env.ADMIN_KEY_DEMO;

const ENTRY_HASH = process.env.ENTRY_HASH;
const ENTRY_KEY = process.env.ENTRY_KEY;

const BAD_ENTRY_TOKEN = process.env.BAD_ENTRY_TOKEN;

const NODE_ENV = process.env.NODE_ENV;

// different DBs for development, testing, and production
const dbFinder = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return process.env.DEV_MONGODB_URI;
    case 'production':
      return process.env.PROD_MONGODB_URI;
    case 'testing':
      return process.env.TEST_MONGODB_URI;
  }
};

const mongourl = dbFinder();

const sceneAllID = process.env.SCENE_ALL_ID;

module.exports = {
  mongourl,
  sceneAllID,
  ADMIN_KEY,
  ADMIN_KEY_DEMO,
  PORT,
  TOKEN,
  RANDY_HASH,
  NODE_ENV,
  SECRET_ENTER,
  SECRET_USER,
  SECRET_ADMIN,
  SECRET_ENTER_DEMO,
  SECRET_ADMIN_DEMO,
  ENTRY_HASH,
  ENTRY_KEY,
  BAD_ENTRY_TOKEN,
};
