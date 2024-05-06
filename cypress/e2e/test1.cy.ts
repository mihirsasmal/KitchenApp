describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://acookclub.vercel.app/')
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.h3-bold').should('have.text', ' Home').and('have.class', 'text-left').and('be.visible');

    cy.get('div.mt-10 > .dark\\:text-light-4').should('have.text', ' No more Recipes to Load').and('be.visible');
    cy.get('.base-medium').should('have.text', ' Test Curry').and('be.visible');

    cy.get('.mr-5 > .small-medium').should('have.text', 'Likes 0').and('be.visible');

    cy.get(':nth-child(2) > .small-medium').should('have.text', 'Save').and('be.visible');

    cy.get('.mr-5 > .cursor-pointer').should('be.visible');
    cy.get(':nth-child(2) > .cursor-pointer').should('be.visible');

    cy.get('.aspect-auto').should('be.visible');
    cy.get('a > .gap-2 > :nth-child(1)').should('have.text', 'by Mihir Sasmal ');
    cy.get('a > .gap-2 > :nth-child(2)').should('have.text', '4/15/2024');
    cy.get('.flex-col.gap-2 > .gap-3 > img').should('be.visible');
    cy.get('.flex-col.gap-2 > .inline-flex').should('have.text', 'Login').and('be.visible').and('be.enabled');
    cy.get('.bg-primary-500 > .flex').should('have.text', 'Home');
    cy.get('.flex-col.gap-2 > .flex-col > :nth-child(2) > .flex').should('have.text', 'Explore');
    cy.get('.flex-col > :nth-child(3) > .flex').should('have.text', 'Your Recipes');
    cy.get('.flex-col > :nth-child(3) > .flex').should('be.visible');
    cy.get(':nth-child(4) > .flex').should('be.visible');
    cy.get(':nth-child(5) > .flex').should('be.visible');
    cy.get(':nth-child(6) > .flex').should('be.visible');
    cy.get(':nth-child(6) > .flex').should('have.text', 'Add');
    cy.get(':nth-child(5) > .flex').should('have.text', 'Saved');
    cy.get(':nth-child(4) > .flex').should('have.text', 'Shared');
    cy.get('.flex-col > :nth-child(3) > .flex').should('have.text', 'Your Recipes');
    cy.get('.gap-9 > .w-fit > .text-slate-300 > span.relative').should('have.text', 'Light');
    cy.get('.gap-9 > .w-fit > .text-slate-300 > span.relative').should('be.visible');
    cy.get('.gap-9 > .w-fit > .text-white').should('be.enabled');
    cy.get('.gap-9 > .w-fit > .text-white > span.relative').should('be.visible');
    cy.get('.gap-9 > .w-fit > .text-white > span.relative').should('have.text', 'Dark');
    /* ==== End Cypress Studio ==== */
  })
})