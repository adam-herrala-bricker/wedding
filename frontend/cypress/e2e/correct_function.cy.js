import text from '../../src/resources/dictionary';
import {
  configDB,
  enterSite,
  loginAsAdmin,
  uploadImage} from '../utils/functions';
import {
  adminUserInfo,
  baseURL,
  logInFields,
  mainPageFields,
} from '../utils/constants';

describe('Correct site function', () => {
  // need to setup the DB and navigate to the page before every test
  beforeEach(() => {
    configDB();
    cy.visit(baseURL);
  });

  it('Entry page renders', () => {
    const langCodes = ['eng', 'suo'];
    const textFields = ['header', 'entryKey', 'enter'];

    // check that all the right text is rendered
    langCodes.map((code) => {
      textFields.map((field) => {
        cy.contains(text[field][code]);
      });
    });
  });

  it('Entry to main site --> renders suo', () => {
    enterSite();

    // check that all the right text is rendered
    mainPageFields.map((field) => {
      cy.contains(text[field].suo);
    });
  });

  it('Entry to main site --> renders eng', () => {
    enterSite();
    cy.get('button[name="eng-flag"]').click(); // switch to English

    // check that all the right text is rendered
    mainPageFields.map((field) => {
      cy.contains(text[field].eng);
    });
  });

  it('Log in window renders (suo)', () => {
    enterSite();
    cy.get('button[name="show-login"]').click();

    // checks that all the right text is renders
    logInFields.map((field) => {
      cy.contains(text[field].suo);
    });
  });

  it('Log in window renders (eng)', () => {
    enterSite();
    cy.get('button[name="eng-flag"]').click(); // sets to English
    cy.get('button[name="show-login"]').click();

    // checks that all the right text is rendered
    logInFields.map((field) => {
      cy.contains(text[field].eng);
    });
  });

  it('Log in as admin', () => {
    enterSite();
    loginAsAdmin();

    // check the the admin username is displayed on screen
    cy.contains(adminUserInfo.username);
  });

  it('Upload image', () => {
    enterSite();
    loginAsAdmin();
    uploadImage('_DSC0815.jpg');
    // check that the image is there
    cy.get('[name="gridImage_DSC0815.jpg"]').should('be.visible');
  });

  it('Scenes functionality', () => {
    const scenes = ['scene0', 'scene1', 'scene2', 'scene3'];
    const image1 = '_DSC0815.jpg';
    const image2 = '_DSC2591.jpg';

    enterSite();
    loginAsAdmin();
    uploadImage(image1);

    // expand scene menu
    cy.get('button').contains(text['filter'].suo).click();

    // make first four scenes
    scenes.map((scene) => {
      cy.get('button').contains(text['new'].suo).click();
      cy.contains(text[scene].suo);
    });

    // delete scene2
    cy.get('button[name="scene-2-del"]').click();
    cy.get('button').contains(text['scene2'].suo).should('not.exist');

    // upload second image
    uploadImage(image2);

    // tag second image as scene0 + scene3
    cy.get(`button[name="${image2}-scene-0"]`).click();
    cy.get(`button[name="${image2}-scene-0"]`)
        .should('have.class', 'scene-linked');
    cy.get(`button[name="${image2}-scene-3"]`).click();
    cy.get(`button[name="${image2}-scene-3"]`)
        .should('have.class', 'scene-linked');

    // confirm scene1 is unlinked
    cy.get(`button[name="${image2}-scene-1"]`)
        .should('have.class', 'scene-unlinked');

    // expect first image to be hidden, second visible
    cy.get(`[name="button${image1}"]`)
        .should('have.class', 'hidden-image');
    cy.get(`[name="button${image2}"]`)
        .should('have.class', 'image-button');

    // after logout, hidden image + under image buttons shouldn't be rendered
    cy.get('button').contains(text['logout'].suo).click();
    cy.get(`button[name="${image2}-scene-0"]`).should('not.exist');
    cy.get(`[name="gridImage${image1}"]`).should('not.exist');

    // but the other image should still be there
    cy.get(`[name="gridImage${image2}"]`)
        .should('exist');

    // image should be in scene0 + scene3
    const markedScenes = ['scene0', 'scene3'];
    markedScenes.map((scene) => {
      cy.get('button')
          .contains(text[scene].suo)
          .click();
      cy.get('button')
          .contains(text[scene].suo)
          .should('have.class', 'scene-name-highlight');
      cy.get(`[name="gridImage${image2}"]`)
          .should('exist');
    });

    // image should not be in scene1
    cy.get('button')
        .contains(text['scene1'].suo)
        .click();
    cy.get('button')
        .contains(text['scene1'].suo)
        .should('have.class', 'scene-name-highlight');
    cy.get(`[name="gridImage${image2}]`)
        .should('not.exist');

    // scene menu closes as expected
    cy.get('button')
        .contains(text['done'].suo)
        .click();
    scenes.map((scene) => {
      cy.get('button')
          .contains(text[scene].suo)
          .should('not.exist');
    });
  });
});
