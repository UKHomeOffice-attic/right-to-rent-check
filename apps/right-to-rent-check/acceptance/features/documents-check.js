'use strict';

const steps = require('../../');

Feature('Given I am on the /documents-check Page');

Before((
  I,
  documentCheckPage
) => {
  I.visitPage(documentCheckPage, steps);
});

Scenario('When I select Yes And Submit the form Then I go to /documents-check-yourself', (
  I,
  documentCheckYourselfPage
) => {
  I.click('#documents-check-yes');
  I.submitForm();
  I.seeInCurrentUrl(documentCheckYourselfPage.url);
});

Scenario('When I select No And Submit the form Then I go to /rental-property-location', (
  I,
  rentalPropertyLocationPage
) => {
  I.click('#documents-check-no');
  I.submitForm();
  I.seeInCurrentUrl(rentalPropertyLocationPage.url);
});

Scenario('When I do not select an option And I submit the form Then I see error', (
  I
) => {
  I.submitForm();
  I.seeErrors('#documents-check-group');
});
