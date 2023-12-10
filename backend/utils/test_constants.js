const bcrypt = require('bcrypt');
const {ENTRY_HASH, ADMIN_KEY, ENTRY_KEY_DEMO} = require('./config');

const badAdminToken = '777777777777777777777777777777777';
const badAdminKey = 'this_is_not_a_valid_admin_key';

const sampleImage = '_DSC0815.jpg';
const sampleAudio = 'down-the-aisle.mp3';

// CRITICAL: paths are from WHERE THE TESTS ARE RUN
// (i.e. /backend), not the test directory
const imageDestinationPath = './media/images';
const imageSourcePath = './media_testing/images';

const audioDestinationPath = './media/audio';
const audioSourcePath = './media_testing/audio';

const imageUploadFile = '_DSC2591.jpg';
const audioUploadFile = 'test36.1c.wav';

const fakeID = '656c6ab67ce7c394fd83d425';

// for entry, an entry key is checked against a pseudouser called 'entry'
const entryUserCredentials = {
  username: 'entry',
  displayname: 'entry',
  email: 'entryuser@gmail.com',
  passwordHash: ENTRY_HASH,
  isAdmin: false,
  adminHash: '',
};

const demoEntryUserInfo = {
  username: 'entry-demo',
  displayname: 'entry demo',
  email: 'entryuser-demo@gmail.com',
  password: ENTRY_KEY_DEMO,
  isAdmin: false,
  isDemo: true,
  adminKey: '',
};

const standardUserInfo = {
  username: 'test.standard',
  displayname: 'Test Standard',
  email: 'test.standard@gmail.org',
  password: 'example',
  isAdmin: false,
  adminKey: '',
};

const adminUserInfo = {
  username: 'test.admin',
  displayname: 'Test Admin',
  email: 'test.admin@gmail.org',
  password: 'example',
  isAdmin: true,
  adminKey: ADMIN_KEY,
};

const imposterInfo = {
  username: 'test.imposter',
  displayname: 'Test Imposter',
  email: 'test.imposter@gmail.org',
  password: 'example',
  isAdmin: true,
  adminKey: badAdminKey,
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

// standard user (also replicates BE)
const getStandardUserCredentials = async () => {
  const dummyPasswordAdmin = 'example';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(dummyPasswordAdmin, saltRounds);

  const thisUser = {
    username: 'test.standard',
    displayname: 'Test Standard',
    email: 'test.standard@gmail.org',
    passwordHash: passwordHash,
    isAdmin: false,
    adminHash: '',
  };

  return thisUser;
};

// "imposter" user (somehow gets onto DB as isAdmin = true,
// but didn't have ADMIN_KEY)
const getImposterCredentials = async () => {
  const dummyPassword = 'example';
  const saltRounds = 10;

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

const image2 = {
  fileName: '_DSC1111.jpg',
  people: [],
  isDemo: true,
};

// audio metadata
const audio1 = {
  fileName: 'groovyJamz.mp3',
};

const audio2 = {
  fileName: 'smoothBeatz,mp3',
  isDemo: true,
};

// DB entries for actual images
const sampleImageDB = { // not demo image
  fileName: '_DSC0815.jpg',
};

module.exports = {
  badAdminToken,
  sampleImage,
  sampleAudio,
  entryUserCredentials,
  demoEntryUserInfo,
  standardUserInfo,
  adminUserInfo,
  imposterInfo,
  getStandardUserCredentials,
  getAdminUserCredentials,
  getImposterCredentials,
  image1,
  image2,
  sampleImageDB,
  audio1,
  audio2,
  imageDestinationPath,
  imageSourcePath,
  audioDestinationPath,
  audioSourcePath,
  imageUploadFile,
  audioUploadFile,
  fakeID,
};
