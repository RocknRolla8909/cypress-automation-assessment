
describe('SauceDemo - E-commerce user flow', () => {

    // Custom login command
    Cypress.Commands.add('login', () => {
        cy.visit('https://www.saucedemo.com/');

        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce');
        cy.get('[data-test="login-button"]').click();

        // Verify successful login
        cy.url().should('include', '/inventory.html');
    });

    it('should complete a purchase with exactly two distinct products', () => {

        // 1. Login
        cy.login();

        // 2. Add two distinct products
        cy.get('[data-test="inventory-container"]')
            .should('be.visible')
            .within(() => {

                // Save first product name
                cy.get('.inventory_item_name')
                    .eq(0)
                    .invoke('text')
                    .as('firstProductName', { type: 'static' });

                // Save second product name
                cy.get('.inventory_item_name')
                    .eq(1)
                    .invoke('text')
                    .as('secondProductName', { type: 'static' });

                // Add first product
                cy.get('.inventory_item')
                    .eq(0)
                    .find('button[data-test^="add-to-cart"]')
                    .click();

                // Add second product
                cy.get('.inventory_item')
                    .eq(1)
                    .find('button[data-test^="add-to-cart"]')
                    .click();
            });

        // 3. Verify cart badge
        cy.get('.shopping_cart_badge')
            .should('be.visible')
            .and('have.text', '2');

        // Verify products are distinct
        cy.get('@firstProductName').then((firstName) => {
            cy.get('@secondProductName').then((secondName) => {
                expect(firstName.trim()).not.to.equal(secondName.trim());
            });
        });

        // 4. Verify products in cart
        cy.get('.shopping_cart_link').click();

        cy.url().should('include', '/cart.html');

        cy.get('.cart_item').should('have.length', 2);

        // Verify first product
        cy.get('@firstProductName').then((name) => {
            cy.get('.cart_item')
                .eq(0)
                .find('.inventory_item_name')
                .should('have.text', name.trim());
        });

        // Verify second product
        cy.get('@secondProductName').then((name) => {
            cy.get('.cart_item')
                .eq(1)
                .find('.inventory_item_name')
                .should('have.text', name.trim());
        });

        // 5. Validate quantities
        cy.get('.cart_quantity')
            .should('have.length', 2)
            .each(($quantity) => {
                cy.wrap($quantity).should('have.text', '1');
            });

        // 6. Complete checkout form
        cy.get('[data-test="checkout"]').click();

        cy.url().should('include', '/checkout-step-one.html');

        cy.get('[data-test="firstName"]')
            .should('be.visible')
            .type('John');

        cy.get('[data-test="lastName"]')
            .should('be.visible')
            .type('Doe');

        cy.get('[data-test="postalCode"]')
            .should('be.visible')
            .type('12345');

        cy.get('[data-test="continue"]').click();

        // 7. Final checkout verification
        cy.url().should('include', '/checkout-step-two.html');

        cy.get('.cart_item').should('have.length', 2);

        // Verify first product in checkout overview
        cy.get('@firstProductName').then((name) => {
            cy.get('.cart_item')
                .eq(0)
                .find('.inventory_item_name')
                .should('have.text', name.trim());
        });

        // Verify second product in checkout overview
        cy.get('@secondProductName').then((name) => {
            cy.get('.cart_item')
                .eq(1)
                .find('.inventory_item_name')
                .should('have.text', name.trim());
        });

        // 8. Complete purchase
        cy.get('[data-test="finish"]').click();

        cy.url().should('include', '/checkout-complete.html');

        // Verify successful purchase
        cy.get('.complete-header')
            .should('be.visible')
            .and('have.text', 'Thank you for your order!');

    });

});
