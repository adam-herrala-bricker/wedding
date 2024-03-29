// constants for Cypress E2E testing

export const ENTRY_KEY = Cypress.env('ENTRY_KEY');
export const ADMIN_KEY = Cypress.env('ADMIN_KEY');

export const baseURL = 'http://localhost:3003';
export const userURL = `${baseURL}/api/users`;

export const image1 = '_DSC0815.jpg';
export const image2 = '_DSC2591.jpg';
export const image3 = '_DSC2596.jpg';

export const logInFields = ['username', 'password', 'login', 'cancel'];

export const scenes = ['scene0', 'scene1', 'scene2', 'scene3'];

export const mainPageFields = [
  'welcomeTxt',
  'welcomeSubTxt',
  'photoTxt',
  'login',
  'exit',
  'music',
  'photos',
];

export const entryUserInfo = {
  username: 'entry',
  displayname: 'entry',
  email: 'entryuser@gmail.com',
  password: ENTRY_KEY,
  isAdmin: false,
  adminKey: '',
};

export const adminUserInfo = {
  username: 'admin.test',
  displayname: 'admin',
  email: 'adminuser@gmail.com',
  password: 'dummy_password_for_testing',
  isAdmin: true,
  adminKey: ADMIN_KEY,
};
