'use strict';

const steps = require('../../');

Feature('property step');

Before((
  I,
  propertyPage
) => {
  I.visitPage(propertyPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  propertyPage
) => {
  I.seeElements([
    propertyPage.fields.yes,
    propertyPage.fields.no
<<<<<<< HEAD
  ]);
=======
  ])
>>>>>>> Landlord Agent page
});

Scenario('I see errors if I submit a form without selecting anything', (
  I,
  propertyPage
) => {
  I.submitForm();
  I.seeErrors(propertyPage.livingStatusGroup);
});

Scenario('I am taken to tenancy start step if I select Yes', (
  I,
  propertyPage,
  tenancyStartPage
) => {
  propertyPage.selectYesAndSubmit();
  I.seeInCurrentUrl(tenancyStartPage.url);
});

Scenario('I am taken to current property step if I select No', (
  I,
  propertyPage,
  currentPropertyAddressPage
) => {
  propertyPage.selectNoAndSubmit();
  I.seeInCurrentUrl(currentPropertyAddressPage.url);
});
