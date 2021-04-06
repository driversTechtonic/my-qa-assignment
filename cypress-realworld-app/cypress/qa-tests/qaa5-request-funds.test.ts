import { User } from "../../src/models";

type NewTransactionTestCtx = {
  allUsers?: User[];
  user?: User;
  contact?: User;
};

describe("Request Funds Transaction", function () {
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

  it("navigates to the new transaction form, selects a user and submits a transaction request", function () {
    const request = {
      amount: "95",
      description: "Fancy Hotel 🏨",
    };

    cy.getBySelLike("new-transaction").click();
    cy.wait("@allUsers");

    cy.getBySelLike("user-list-item").contains(ctx.contact!.firstName).click({ force: true });
    cy.visualSnapshot("User Search First Name Input");

    cy.getBySelLike("amount-input").type(request.amount);
    cy.getBySelLike("description-input").type(request.description);
    cy.visualSnapshot("Amount and Description Input");
    cy.getBySelLike("submit-request").click();
    cy.wait("@createTransaction");
    cy.getBySel("alert-bar-success")
      .should("be.visible")
      .and("have.text", "Transaction Submitted!");
    cy.visualSnapshot("Transaction Request Submitted Notification");

    cy.getBySelLike("return-to-transactions").click();
    cy.getBySelLike("personal-tab").click().should("have.class", "Mui-selected");

    cy.getBySelLike("transaction-item").should("contain", request.description);
    cy.visualSnapshot("Transaction Item Description in List");
  });
});
