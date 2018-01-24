'use strict';

const steps = require('../../');

Feature('Given I am on /person-in-property page');

Before((
  I,
  personInPropertyPage
) => {
  I.visitPage(personInPropertyPage, steps);
});

// Scenario('Then I see the correct fields on the page', (
//   I,
//   personInPropertyPage
// ) => {
//   I.seeElements([
//     personInPropertyPage.fields.yes,
//     personInPropertyPage.fields.no
//   ]);
// });

Scenario('When I do NOT select a field And submit the form I see an error', (
  I,
  personInPropertyPage
) => {
  I.submitForm();
  I.seeErrors(personInPropertyPage.livingStatusGroup);
});

Scenario('When I select Yes And submit the form Then I am taken to /tenancy-start page', (
  I,
  personInPropertyPage,
  tenancyStartPage
) => {
  personInPropertyPage.selectYesAndSubmit();
  I.seeInCurrentUrl(tenancyStartPage.url);
});

Scenario('When I select No And submit the form Then I am taken to the /tenant-in-uk page', (
  I,
  personInPropertyPage,
  tenantInUkPage
) => {
  personInPropertyPage.selectNoAndSubmit();
  I.seeInCurrentUrl(tenantInUkPage.url);
});
