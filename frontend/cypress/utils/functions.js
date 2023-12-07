import {
  adminUserInfo,
  entryUserInfo,
  baseURL,
  userURL,
} from '../utils/constants';

const ENTRY_KEY = Cypress.env('ENTRY_KEY');

// functions that package operations that are repated in E2E testing

export const configDB = () => {
  // clear DB
  cy.request('POST', `${baseURL}/api/testing/reset`);

  // add entry 'user' to DB
  cy.request('POST', userURL, entryUserInfo);

  // add admin user to DB
  cy.request('POST', userURL, adminUserInfo);
};

export const enterSite = () => {
  cy.get('input[name="entry"]').type(ENTRY_KEY);
  cy.get('button').click();
};

export const loginAsAdmin = () => {
  cy.get('button[name="show-login"]').click();
  cy.get('input[name="Username"]').type(adminUserInfo.username);
  cy.get('input[name="Password"]').type(adminUserInfo.password);
  cy.get('button[id="login-button"]').click();
};

export const uploadImage = (fileName) => {
  cy.get('input[type="file"]')
      .selectFile(`../backend/media_testing/images/${fileName}`);
  cy.get('button').contains('submit').click();
};

export const uploadAudio = (fileName) => {
  cy.get('input[type="file"]')
      .selectFile(`../backend/media_testing/audio/${fileName}`);
  cy.get('button').contains('submit').click();
};
