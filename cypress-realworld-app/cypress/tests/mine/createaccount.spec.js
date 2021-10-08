/// <reference types="cypress" />

describe("Create Account", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it.only("new account test", () => {
    cy.get("#firstName").type("Danielle");
    cy.get("#lastName").type("Rivers");
    cy.get("#username").type("Drivers");
    cy.get("#password").type("aQua4rce");
    cy.get("#confirmPassword").type("aQua4rce");
    cy.get("[data-test=signup-submit]").click();
  });

  it.only("confirm password fail test", () => {
    cy.get("#firstName").type("Danielle");
    cy.get("#lastName").type("Rivers");
    cy.get("#username").type("Drivers");
    cy.get("#password").type("aQua4rce");
    cy.get("#confirmPassword").type("aQua3rce");
  });

  it.only("empty fields test", () => {
    cy.get("[data-test=signup-submit]").click();
  });
});
