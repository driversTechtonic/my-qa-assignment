/// <reference types="cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  it.only("login test", () => {
    cy.get("#username").type("Katharina_Bernier");
    cy.get("#password").type("s3cret");
    cy.get("[data-test=signin-submit]").click();
  });

  it.only("invalid login test", () => {
    cy.get("#username").type("Katharina_Berry");
    cy.get("#password").type("s4cret");
    cy.get("[data-test=signin-submit]").click();
  });
});
