# Cypress Automation Assessment

## Overview

This repository contains UI and API automation tests developed using Cypress and JavaScript.

The purpose of this project is to demonstrate practical knowledge of test automation, API testing, assertions, test data handling, and automation best practices.

## Tech Stack

- JavaScript
- Cypress
- Node.js
- REST API
- Git / GitHub

## Project Structure

```text
cypress/
├── e2e/
│   ├── ui/
│   │   └── saucedemo.cy.js
│   └── api/
│       └── restful-booker.cy.js
```

## Test Scenarios

### 1. UI Automation - SauceDemo

Website: https://www.saucedemo.com/

- User authentication.
- Add two distinct products to the shopping cart.
- Validate cart contents and quantities.
- Complete checkout information.
- Verify successful purchase.

### 2. API Automation - Restful Booker

API: https://restful-booker.herokuapp.com/

- Generate authentication token.
- Create a booking.
- Retrieve booking using its dynamic ID.
- Update booking using authentication token.
- Delete booking.
- Verify deletion using HTTP 404 response.
