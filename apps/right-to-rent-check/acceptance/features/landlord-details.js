'use strict';

const steps = require('../../');

Feature('Landlord Details Page');

Before((
  I,
  landlordDetailsPage
) => {
  I.visitPage(landlordDetailsPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  landlordDetailsPage
) => {
  I.seeElements([
    landlordDetailsPage.fields.name,
    landlordDetailsPage.fields.company,
    landlordDetailsPage.fields.email,
    landlordDetailsPage.fields.phone
  ]);
});

Scenario('I see errors if I submit the form without completing', (
  I,
  landlordDetailsPage
) => {
  I.submitForm();
  I.seeErrors([
    landlordDetailsPage.fields.name,
    landlordDetailsPage.fields.email,
    landlordDetailsPage.fields.phone
  ]);
});

Scenario('I see an error if I enter an invalid email address', (
  I,
  landlordDetailsPage
) => {
  I.fillField(landlordDetailsPage.fields.email, landlordDetailsPage.content.invalidEmail);
  I.submitForm();
  I.seeErrors(landlordDetailsPage.fields.email);
});

Scenario('I am taken to the landlord address step on a valid submission', (
  I,
  landlordDetailsPage
) => {
  I.fillField(landlordDetailsPage.fields.company, landlordDetailsPage.content.company);
  I.fillField(landlordDetailsPage.fields.name, landlordDetailsPage.content.name);
  I.fillField(landlordDetailsPage.fields.email, landlordDetailsPage.content.email);
  I.fillField(landlordDetailsPage.fields.phone, landlordDetailsPage.content.phone);
  I.submitForm();
  I.seeInCurrentUrl('/landlord-address');
});
