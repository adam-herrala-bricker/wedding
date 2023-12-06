import text from '../../src/resources/dictionary';

it('Bad entry key', () => {
  cy.visit('http://localhost:3003');

  cy.get('input[name="entry"]').type('wrong_entry_key');
  cy.get('button').click();

  cy.contains(text['entryError'].suo);
});
