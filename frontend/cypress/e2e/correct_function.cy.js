import text from '../../src/resources/dictionary';
import {configDB, enterSite, loginAsAdmin} from '../utils/functions';
import {
  adminUserInfo,
  baseURL,
  logInFields,
  mainPageFields,
} from '../utils/constants';

describe('Correct site function', () => {
  // this is like beforeAll()
  before(() => {
    configDB();
  });

  // need to navitage to page before every test
  beforeEach(() => {
    cy.visit(baseURL);
  });

  it('Entry page renders', () => {
    const langCodes = ['eng', 'suo'];
    const textFields = ['header', 'entryKey', 'enter'];

    langCodes.map((code) => {
      textFields.map((field) => {
        cy.contains(text[field][code]);
      });
    });
  });

  it('Entry to main site --> renders suo', () => {
    enterSite();

    mainPageFields.map((field) => {
      cy.contains(text[field].suo);
    });
  });

  it('Entry to main site --> renders eng', () => {
    enterSite();
    cy.get('button[name="eng-flag"]').click();

    mainPageFields.map((field) => {
      cy.contains(text[field].eng);
    });
  });

  it('Log in window renders (suo)', () => {
    enterSite();
    cy.get('button[name="show-login"]').click();

    logInFields.map((field) => {
      cy.contains(text[field].suo);
    });
  });

  it('Log in window renders (eng)', () => {
    enterSite();
    cy.get('button[name="eng-flag"]').click();
    cy.get('button[name="show-login"]').click();

    logInFields.map((field) => {
      cy.contains(text[field].eng);
    });
  });

  it('Log in as admin', () => {
    enterSite();
    loginAsAdmin();
    cy.contains(adminUserInfo.username);
  });

  it('Upload image', () => {
    enterSite();
    loginAsAdmin();
    cy.get('input[type="file"]')
        .selectFile('../backend/media_testing/images/_DSC0815.jpg');
    cy.get('button').contains('submit').click();

    cy.get('[name="gridImage_DSC0815.jpg"]').should('be.visible');
  });
});
