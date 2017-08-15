'use strict';

const steps = require('../../');

Feature('Start Page');

Before((
  I,
  startPage
) => {
  I.visitPage(startPage, steps);
});

Scenario('When I click continue Then I am taken to the tenant details page', (
  I,
  tenantDetailsPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});
