import { User } from "../../src/models";

describe("Unsuccessful User Login", function () {
  beforeEach(function () {
    cy.task("db:seed");

    cy.server();
    cy.route("POST", "/users").as("signup");
    cy.route("POST", "/bankAccounts").as("createBankAccount");
  });

  it("should redirect unauthenticated user to signin page", function () {
    cy.visit("/personal");
    cy.location("pathname").should("equal", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should search for user", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", true);
    });

  it("should not allow a visitor to login", function () {
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy92",
      password: "s3crets",
    };
   

  it("should display login errors", function () {
    cy.visit("/");

    cy.getBySel("signin-username").type("User").find("input").clear().blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
    cy.visualSnapshot("Display Username is Required Error");

    cy.getBySel("signin-password").type("abc").find("input").blur();
    cy.get("#password-helper-text")
      .should("be.visible")
      .and("contain", "Password must contain at least 4 characters");
    cy.visualSnapshot("Display Password Error");

    cy.getBySel("signin-submit").should("be.disabled");
    cy.visualSnapshot("Sign In Submit Disabled");
  });

  it("should error for an invalid user", function () {
    cy.login("invalidUserName", "invalidPa$$word");

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username and Password, Username or Password is Invalid");
  });

  it("should error for an invalid password for existing user", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "INVALID");
    });

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username, Username or Password is Invalid");
  });
  
});