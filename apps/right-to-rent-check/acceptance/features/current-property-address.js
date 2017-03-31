'use strict';

const steps = require('../../');

Feature('current property address step');

Before((
  I,
  currentPropertyAddressPage
) => {
  I.visitPage(currentPropertyAddressPage, steps);
});

Scenario('I am taken to the tenant-details page on a valid submission', (
  I,
  currentPropertyAddressPage,
  tenantDetailsPage
) => {
  currentPropertyAddressPage.completeAddress();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});
