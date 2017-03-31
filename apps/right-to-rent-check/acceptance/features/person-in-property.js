'use strict';

const steps = require('../../');

Feature('person in property step');

Before((
  I,
  personInPropertyPage
) => {
  I.visitPage(personInPropertyPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  personInPropertyPage
) => {
  I.seeElements([
    personInPropertyPage.fields.yes,
    personInPropertyPage.fields.no
  ]);
});

Scenario('I see errors if I submit a form without selecting anything', (
  I,
  personInPropertyPage
) => {
  I.submitForm();
  I.seeErrors(personInPropertyPage.livingStatusGroup);
});

Scenario('I am taken to tenancy start step if I select Yes', (
  I,
  personInPropertyPage,
  tenancyStartPage
) => {
  personInPropertyPage.selectYesAndSubmit();
  I.seeInCurrentUrl(tenancyStartPage.url);
});

Scenario('I am taken to current property step if I select No', (
  I,
  personInPropertyPage,
  personLocationPage
) => {
  personInPropertyPage.selectNoAndSubmit();
  I.seeInCurrentUrl(personLocationPage.url);
});
