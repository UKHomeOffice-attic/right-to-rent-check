'use strict';

const steps = require('../../');

Feature('Landlord\'s Name Step');

Before((
  I,
  landlordNamePage
) => {
  I.visitPage(landlordNamePage, steps);
});

Scenario('The correct fields are on the page', (
  I,
  landlordNamePage
) => {
  I.seeElements(landlordNamePage.fields.name);
});

Scenario('I see an error if I submit the form without completing', (
  I,
  landlordNamePage
) => {
  I.submitForm();
  I.seeErrors(landlordNamePage.fields.name);
});

Scenario('I am taken to the landlord address page on a valid submission', (
  I,
  landlordNamePage,
  landlordAddressPage
) => {
  I.fillField(landlordNamePage.fields.name, landlordNamePage.content.name);
  I.submitForm();
  I.seeInCurrentUrl(landlordAddressPage.url);
});
