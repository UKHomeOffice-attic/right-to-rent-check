'use strict';

const steps = require('../../');

Feature('Agent Details Page');

Before((
  I,
  startPage
) => {
  I.visitPage(startPage, steps);
});

Scenario('I am taken to the property step when I click continue', (
  I,
  propertyPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(propertyPage.url);
});
