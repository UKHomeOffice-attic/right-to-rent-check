'use strict';

const steps = require('../../');

Feature('current property address step');

Before((
  I,
  currentPropertyAddressPage
) => {
  I.visitPage(currentPropertyAddressPage, steps);
});

Scenario('When I submit a valid address Then I am taken to the check confirmed page', (
  I,
  currentPropertyAddressPage,
  checkConfirmedPage
) => {
  currentPropertyAddressPage.completeAddress();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
