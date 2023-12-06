import text from '../../src/resources/dictionary';
import {configDB, enterSite, loginAsAdmin} from '../utils/functions';
import {baseURL} from '../utils/constants';

describe('Correct site function', () => {
  // this is like beforeAll()
  before(() => {
    configDB();
  });

  // need to navitage to page before every test
  beforeEach(() => {
    cy.visit(baseURL);
  });

  describe('Site entry', () => {
    it('Entry page renders', () => {
      const langCodes = ['eng', 'suo'];
      const textFields = ['header', 'entryKey', 'enter'];

      langCodes.map((code) => {
        textFields.map((field) => {
          cy.contains(text[field][code]);
        });
      });
    });

    it('Entry to main site', () => {
      enterSite();
      cy.contains(text['welcomeTxt'].suo);
    });
  });

  describe('Admin user', () => {
    beforeEach(() => {
      cy.visit(baseURL);
      enterSite();
    });

    it('Log in as admin', () => {
      loginAsAdmin();
    });
  });
});
