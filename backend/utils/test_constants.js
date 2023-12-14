const {ENTRY_HASH, ADMIN_KEY, ENTRY_KEY_DEMO} = require('./config');

const badAdminToken = '777777777777777777777777777777777';
const badAdminKey = 'this_is_not_a_valid_admin_key';

const sampleImage = '_DSC0815.jpg';
const sampleDemoImage = '_DSC2591.jpg';

const sampleAudio = 'down-the-aisle.mp3';
const sampleDemoAudio = 'test36.1c.wav';

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
const sampleAudioDB = {
  fileName: sampleAudio, // not demo audio
};

const sampleDemoAudioDB = {
  fileName: sampleDemoAudio, // demo audio
  isDemo: true,
};

// image metadata
const sampleImageDB = { // not demo image
  fileName: sampleImage,
};

const sampleDemoImageDB = { // demo image
  fileName: sampleDemoImage,
  isDemo: true,
};

module.exports = {
  badAdminToken,
  badAdminKey,
  sampleImage,
  sampleDemoImage,
  sampleAudio,
  sampleDemoAudio,
  entryUserCredentials,
  demoEntryUserInfo,
  standardUserInfo,
  adminUserInfo,
  imposterInfo,
  image1,
  image2,
  sampleImageDB,
  sampleDemoImageDB,
  sampleAudioDB,
  sampleDemoAudioDB,
  imageDestinationPath,
  imageSourcePath,
  audioDestinationPath,
  audioSourcePath,
  imageUploadFile,
  audioUploadFile,
  fakeID,
};
