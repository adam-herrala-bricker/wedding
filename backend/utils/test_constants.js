const bcrypt = require('bcrypt');
const {ENTRY_HASH, ADMIN_KEY} = require('./config');

const badAdminToken = '777777777777777777777777777777777';

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

// admin user (replicate what happens on the BE)
const getAdminUserCredentials = async () => {
  const dummyPasswordAdmin = 'example';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(dummyPasswordAdmin, saltRounds);
  const adminHash = await bcrypt.hash(ADMIN_KEY, saltRounds);

  const thisUser = {
    username: 'test.admin',
    displayname: 'Test Admin',
    email: 'test.admin@gmail.org',
    passwordHash: passwordHash,
    isAdmin: true,
    adminHash: adminHash,
  };

  return thisUser;
};

// "imposter" user (somehow gets onto DB as isAdmin = true,
// but didn't have ADMIN_KEY)
const getImposterCredentials = async () => {
  const dummyPassword = 'example';
  const saltRounds = 10;
  const badAdminKey = 'this_is_not_a_valid_admin_key';

  const passwordHash = await bcrypt.hash(dummyPassword, saltRounds);
  const adminHash = await bcrypt.hash(badAdminKey, saltRounds);

  const thisUser = {
    username: 'test.imposter',
    displayname: 'Test Imposter',
    email: 'test.imposter@gmail.org',
    passwordHash: passwordHash,
    isAdmin: true,
    adminHash: adminHash,
  };

  return thisUser;
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
  badAdminToken,
  sampleImage,
  sampleAudio,
  entryUserCredentials,
  getAdminUserCredentials,
  getImposterCredentials,
  image1,
  audio1,
};
