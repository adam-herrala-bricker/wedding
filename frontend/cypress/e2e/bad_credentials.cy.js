import text from '../../src/resources/dictionary';
import {configDB, enterSite} from '../utils/functions';
import {adminUserInfo, baseURL} from '../utils/constants';

describe('Bad credentials', () => {
  beforeEach(() => {
    configDB();
    cy.visit(baseURL);
  });

  it('Bad entry key', () => {
    cy.get('input[name="entry"]').type('wrong_entry_key');
    cy.get('button').click();

    cy.contains(text['entryError'].suo);
    cy.contains(text['entryError'].eng);
  });

  it('Bad user login (suo)', () => {
    enterSite();

    // try to log in with wrong password
    cy.get('button[name="show-login"]').click();
    cy.get('input[name="Username"]').type(adminUserInfo.username);
    cy.get('input[name="Password"]').type('wrong_admin_password');
    cy.get('button[id="login-button"]').click();

    // renders correct error message
    cy.contains(text['loginError'].suo);
  });

  it.only('Bad user login (eng)', () => {
    enterSite();
    cy.get('button[name="eng-flag"]').click(); // sets to English

    cy.get('button[name="show-login"]').click();
    cy.get('input[name="Username"]').type(adminUserInfo.username);
    cy.get('input[name="Password"]').type('wrong_admin_password');
    cy.get('button[id="login-button"]').click();

    cy.contains(text['loginError'].eng);
  });
});
