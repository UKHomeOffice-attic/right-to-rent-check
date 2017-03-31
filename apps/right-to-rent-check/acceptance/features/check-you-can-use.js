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
  propertyAddressPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(propertyAddressPage.url);
});
