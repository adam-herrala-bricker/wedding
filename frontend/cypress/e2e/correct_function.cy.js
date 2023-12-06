import text from '../../src/resources/dictionary';

describe('Site entry', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3003');
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

  it('Entry to main site', () => {
    const ENTRY_KEY = Cypress.env('ENTRY_KEY');
    cy.get('input[name="entry"]').type(ENTRY_KEY);
    cy.get('button').click();

    cy.contains(text['welcomeTxt'].suo);
  });
});
