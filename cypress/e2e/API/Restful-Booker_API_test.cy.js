describe('Automate the lifecycle of a booking by chaining API requests', () => {
  const baseUrl = 'https://restful-booker.herokuapp.com';
  let token;
  let bookingId;

  it('Automate the lifecycle of a booking by chaining API requests', () => {
    // 1 Generate auth token
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth`,
      body: {
        username: 'admin',
        password: 'password123',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        token = response.body.token;

        // 2 Create Booking
        return cy.request({
          method: 'POST',
          url: `${baseUrl}/booking`,
          body: {
            firstname: 'John',
            lastname: 'Doe',
            totalprice: 1500,
            depositpaid: true,
            bookingdates: {
              checkin: '2026-11-06',
              checkout: '2026-11-08',
            },
            additionalneeds: 'Pets',
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('bookingid');
        expect(response.body.booking.firstname).to.eq('John');
        
        bookingId = response.body.bookingid;

        // 3 Read Booking
        return cy.request({
          method: 'GET',
          url: `${baseUrl}/booking/${bookingId}`,
          headers: {
            Accept: 'application/json',
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.firstname).to.eq('John');
        expect(response.body.lastname).to.eq('Doe');
        expect(response.body.totalprice).to.eq(1500);

        // 4 Update Booking
        return cy.request({
          method: 'PUT',
          url: `${baseUrl}/booking/${bookingId}`,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`,
          },
          body: {
            firstname: 'Johnathan',
            lastname: 'Doe',
            totalprice: 1800,
            depositpaid: true,
            bookingdates: {
              checkin: '2026-01-01',
              checkout: '2027-01-01', 
            },
            additionalneeds: 'Lunch',
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.firstname).to.eq('Johnathan');
        expect(response.body.totalprice).to.eq(1800);
        expect(response.body.bookingdates.checkout).to.eq('2027-01-01');

        // 5 Delete Booking
        return cy.request({
          method: 'DELETE',
          url: `${baseUrl}/booking/${bookingId}`,
          headers: {
            'Cookie': `token=${token}`,
          },
        });
      })
      .then((response) => {
        expect(response.status).to.eq(201);

        // Confirm with GET: expect 404 Not Found
        cy.request({
          method: 'GET',
          url: `${baseUrl}/booking/${bookingId}`,
          failOnStatusCode: false,
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(404);
        });
      });
  });
});