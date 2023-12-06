import text from '../../src/resources/dictionary';

describe('Site entry', () => {
  it('Entry page renders', () => {
    cy.visit('http://localhost:3003');
    cy.contains(text['enter'].eng);
  });
});
