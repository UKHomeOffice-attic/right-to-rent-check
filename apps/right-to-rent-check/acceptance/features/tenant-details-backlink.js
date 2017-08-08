'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Add Another Page Back Link');

Before((
  I,
  tenantAddAnotherPage
) => {
  I.visitPage(tenantAddAnotherPage, steps);
});

Scenario('I am taken to the tenant-additonal-details page', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.backLink);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
});

Scenario('I am taken back to the tenant-add-another page if click submit', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.backLink);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});
