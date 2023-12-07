import text from '../../src/resources/dictionary';
import {
  configDB,
  enterSite,
  loginAsAdmin,
  uploadImage,
} from '../utils/functions';
import {baseURL, image1, image2, image3} from '../utils/constants';

describe('Highlight view', () => {
  beforeEach(() => {
    configDB();
    cy.visit(baseURL);
  });

  it('Highlight view', () => {
    enterSite();
    loginAsAdmin();

    // upload images (out of order to verify sorting)
    const images = [image3, image1, image2];
    images.map((image) => {
      uploadImage(image);
      cy.get(`[name="gridImage${image}"]`)
          .should('exist');
    });

    // expand scene menu
    cy.get('button').contains(text['filter'].suo).click();

    // make scene0 (i.e. 'all/kaikki')
    cy.get('button').contains(text['new'].suo).click();
    cy.contains(text['scene0'].suo);

    // tag all images as scene0
    images.map((image) => {
      cy.get(`button[name="${image}-scene-0"]`).click();
      cy.get(`button[name="${image}-scene-0"]`)
          .should('have.class', 'scene-linked');
    });

    // click on image1
    cy.get(`button[name="button${image1}"]`).click();

    // highlight view is rendered correctly
    cy.get('button')
        .contains(text['download'].suo)
        .should('be.visible');
    cy.get(`[name="highlight${image1}"]`)
        .should('be.visible');

    // clicking left stays on image1
    cy.get('button[name="scroll-left"]').click();
    cy.get(`[name="highlight${image1}"]`)
        .should('be.visible');

    // clicking right takes us to image2
    cy.get('button[name="scroll-right"]').click();
    cy.get(`[name="highlight${image2}"]`)
        .should('be.visible');

    // clicking left returns us to image1
    cy.get('button[name="scroll-left"]').click();
    cy.get(`[name="highlight${image1}"]`)
        .should('be.visible');

    // clicking right twice takes us to image2 then image 3
    cy.get('button[name="scroll-right"]').click();
    cy.get(`[name="highlight${image2}"]`)
        .should('be.visible');
    cy.get('button[name="scroll-right"]').click();
    cy.get(`[name="highlight${image3}"]`)
        .should('be.visible');

    // clicking right again stays on image3
    cy.get('button[name="scroll-right"]').click();
    cy.get(`[name="highlight${image3}"]`)
        .should('be.visible');

    // clicking left goes back to image2
    cy.get('button[name="scroll-left"]').click();
    cy.get(`[name="highlight${image2}"]`)
        .should('be.visible');

    // close button returns to main page
    cy.get('button[name="close-button"]').click();
    images.map((image) => {
      cy.get(`[name="gridImage${image}"]`)
          .should('be.visible');
    });
  });
});
