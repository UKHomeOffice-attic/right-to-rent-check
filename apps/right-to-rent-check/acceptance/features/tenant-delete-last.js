'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Deleting the last tenant');

Before((
  I,
  tenantAddAnotherPage
) => {
  I.visitPage(tenantAddAnotherPage, steps);
  I.seeNumberOfElements('.tenant-details', 1);
});

Scenario('I see all fields empty on the the tenant-details page', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage,
  tenantAdditionalDetailsPage
) => {
  I.click('.tenant-details:first-of-type tr:nth-child(7) > td:nth-child(4) > a');
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInField('tenant-name', '');
  I.seeInField('tenant-dob-day', '');
  I.seeInField('tenant-dob-month', '');
  I.seeInField('tenant-dob-year', '');
  I.seeInField('tenant-country', '');
});

Scenario('I see tenant-additional-details page when I submit', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage,
  tenantAdditionalDetailsPage
) => {
  I.click('.tenant-details:first-of-type tr:nth-child(7) > td:nth-child(4) > a');
  I.fillField('tenant-name', 'aaa');
  I.fillField('tenant-dob-day', '1');
  I.fillField('tenant-dob-month', '1');
  I.fillField('tenant-dob-year', '1980');
  I.fillField('tenant-country', 'Uganda');

  I.submitForm();
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url)
});


