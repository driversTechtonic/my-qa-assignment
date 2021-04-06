import { User } from "../../src/models";

type NewTransactionTestCtx = {
  allUsers?: User[];
  user?: User;
  contact?: User;
};

describe("Send Funds Transaction", function () {
  const ctx: NewTransactionTestCtx = {};

  beforeEach(function () {
    cy.task("db:seed");

    cy.server();
    cy.route("POST", "/transactions").as("createTransaction");

    cy.route("GET", "/users").as("allUsers");
    cy.route("GET", "/notifications").as("notifications");
    cy.route("GET", "/transactions/public").as("publicTransactions");
    cy.route("GET", "/transactions").as("personalTransactions");
    cy.route("GET", "/users/search*").as("usersSearch");
    cy.route("PATCH", "/transactions/*").as("updateTransaction");

    cy.database("filter", "users").then((users: User[]) => {
      ctx.allUsers = users;
      ctx.user = users[0];
      ctx.contact = users[1];

      return cy.loginByXstate(ctx.user.username);
    });
  });

  it("navigates to the new transaction form, selects a user and submits a transaction payment", function () {
    const payment = {
      amount: "35",
      description: "Sushi dinner 🍣",
    };

    cy.getBySelLike("new-transaction").click();
    cy.wait("@allUsers");

    cy.getBySel("user-list-search-input").type(ctx.contact!.firstName, { force: true });
    cy.wait("@usersSearch");
    cy.visualSnapshot("User Search First Name Input");

    cy.getBySelLike("user-list-item").contains(ctx.contact!.firstName).click({ force: true });
    cy.visualSnapshot("User Search First Name List Item");

    cy.getBySelLike("amount-input").type(payment.amount);
    cy.getBySelLike("description-input").type(payment.description);
    cy.visualSnapshot("Amount and Description Input");
    cy.getBySelLike("submit-payment").click();
    cy.wait(["@createTransaction", "@getUserProfile"]);
    cy.getBySel("alert-bar-success")
      .should("be.visible")
      .and("have.text", "Transaction Submitted!");
  });
});
