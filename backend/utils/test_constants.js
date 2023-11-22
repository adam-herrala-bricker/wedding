const {ENTRY_HASH} = require('./config');

const sampleImage = '_DSC0815.jpg';
const sampleAudio = 'down-the-aisle.mp3';

// for entry, an entry key is checked against a pseudouser called 'entry'
const entryUserCredentials = {
  username: 'entry',
  displayname: 'entry',
  email: 'entryuser@gmail.com',
  passwordHash: ENTRY_HASH,
  isAdmin: false,
  adminHash: '',
};

// image metadata
const image1 = {
  fileName: '_DSC9999.jpg',
  people: [],

};

// audio metadata
const audio1 = {
  fileName: 'groovyJamz.mp3',
};

module.exports = {
  sampleImage,
  sampleAudio,
  entryUserCredentials,
  image1,
  audio1,
};
