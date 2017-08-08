'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Add Another Page Details Change links');

Before((
  I,
  tenantAddAnotherPage
) => {
  I.visitPage(tenantAddAnotherPage, steps);
});

Scenario('I see the tenant-details page if I click the change `Name` button', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.name);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInCurrentUrl('#tenant-name');
});

Scenario('I see the tenant-details page if I click the change `Date of Birth` button', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.dob);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInCurrentUrl('#tenant-dob');
});

Scenario('I see the tenant-details page if I click the change `Nationality` button', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.country);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInCurrentUrl('#tenant-country');
});

Scenario('I see the tenant-additional-details page if I click the change `Home Office reference number` button', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.reference);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInCurrentUrl('#tenant-reference-number');
});

Scenario('I see the tenant-additional-details page if I click the change `Passport number` button', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.passport);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInCurrentUrl('#tenant-passport-number');
});

Scenario('I see the tenant-additional-details page if I click the change `BRP number` button', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.brp);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInCurrentUrl('#tenant-brp-number');
});

Scenario('I see the tenant-additional-details page if I click the change `Recorded Delivery number` button', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.delivery);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInCurrentUrl('#tenant-recorded-delivery-number');
});
