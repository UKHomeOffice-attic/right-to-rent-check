'use strict';

const steps = require('../../');

Feature('Check-you-can-use page');

Before((
  I,
  checkYouCanUsePage
) => {
  I.visitPage(checkYouCanUsePage, steps);
});

Scenario('I go to the property page after I click continue', (
  I,
  propertyPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(propertyPage.url);
});
