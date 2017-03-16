'use strict';

const steps = require('../../');

Feature('Agent Details Page');

Before((
  I,
  startPage
) => {
  I.visitPage(startPage, steps);
});

Scenario('I am taken to the check you can use step when I click continue', (
  I,
  checkYouCanUsePage
) => {
  I.submitForm();
  I.seeInCurrentUrl(checkYouCanUsePage.url);
});
