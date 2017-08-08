'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Edit Tenant Details');

Before((
  I,
  tenantDetailsPage
) => {
  I.visitPage(tenantDetailsPage, steps);
  I.fillField('#tenant-name', 'foo');
  I.fillField('#tenant-dob-day', '01');
  I.fillField('#tenant-dob-month', '01');
  I.fillField('#tenant-dob-year', '1980');
  I.fillField('#tenant-country', 'Uganda');
  I.submitForm();
  I.click('#tenant-additional-details-passport-number');
  I.fillField('#tenant-passport-number', '0000000000');
  I.submitForm();
});

Scenario('I see the changes on tenant-another page if I edit the tenant-details form', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.name);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.fillField('#tenant-name', 'bar');
  I.fillField('#tenant-dob-year', '1981');
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
  I.see('bar');
  I.see('1981');
});

Scenario('I see the changes on tenant-another page if I edit the tenant-additional-details form', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click(tenantAddAnotherPage.selectors.change.passport);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.click('#tenant-additional-details-passport-number');
  I.click('#tenant-additional-details-brp-number');
  I.fillField('#tenant-brp-number', '123456789');
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
  I.see('123456789');
  I.dontSee('0000000000');
});
