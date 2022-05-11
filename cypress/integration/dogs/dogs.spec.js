describe("dogs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("have a bunch of dogs", () => {
    cy.get("div.dog h3").should("have.length", 49);
    cy.get("div.dog h3").first().should("have.text", "Abby");
  });

  it("should have the title", () => {
    cy.get(".site-name").should("include.text", "Adoptable Dogs");
  });

  it("have a bunch of dogs", () => {
    cy.get("div.dog h3").should("have.length", 49);
    cy.get("div.dog h3").first().should("have.text", "Abby");
  });

  it("should be able to filter by sex", () => {
    cy.get("#sexSelect").click();
    cy.get("#sexMale").click();
    cy.get("div.dog h3").should("have.length", 22);
    cy.get("div.dog h3").first().should("have.text", "Abra");
  });

  it("get a detail page", () => {
    cy.get("div.dog h3").first().should("have.text", "Abby").click();
    cy.get(".dog-name").should("have.text", "Abby");
  });

  it("should filter by name", () => {
    cy.get("#textFilter").type("Abra");
    cy.get("div.dog h3").should("have.length", 1);
    cy.get("div.dog h3").first().should("have.text", "Abra");
    cy.screenshot("filter-by-name");
  });
});
