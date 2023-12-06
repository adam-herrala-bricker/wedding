// constants for Cypress E2E testing

export const ENTRY_KEY = Cypress.env('ENTRY_KEY');
export const ADMIN_KEY = Cypress.env('ADMIN_KEY');

export const baseURL = 'http://localhost:3003';
export const userURL = `${baseURL}/api/users`;

export const entryUserInfo = {
  username: 'entry',
  displayname: 'entry',
  email: 'entryuser@gmail.com',
  password: ENTRY_KEY,
  isAdmin: false,
  adminKey: '',
};

export const adminUserInfo = {
  username: 'admin',
  displayname: 'admin',
  email: 'adminuser@gmail.com',
  password: 'dummy_password_for_testing',
  isAdmin: true,
  adminKey: ADMIN_KEY,
};
