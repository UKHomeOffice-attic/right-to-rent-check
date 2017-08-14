'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Deleting the first of two tenants');

Before((
  I,
  tenantDetailsPage
) => {
  I.visitPage(tenantDetailsPage, steps);

  I.fillField('#tenant-name', 'aaa');
  I.fillField('#tenant-dob-day', '1');
  I.fillField('#tenant-dob-month', '1');
  I.fillField('#tenant-dob-year', '1980');
  I.fillField('#tenant-country', 'United Kingdom');
  I.submitForm();

  I.seeInCurrentUrl('tenant-additional-details');
  I.submitForm();

  I.seeInCurrentUrl('tenant-another');
  I.seeNumberOfElements('.tenant-details', 1);

  I.click('#tenant-add-another-yes');
  I.submitForm();

  I.fillField('tenant-name', 'bbb');
  I.fillField('tenant-dob-day', '2');
  I.fillField('tenant-dob-month', '2');
  I.fillField('tenant-dob-year', '1981');
  I.fillField('tenant-country', 'India');
  I.submitForm();

  I.seeInCurrentUrl('tenant-additional-details');
  I.submitForm();

  I.seeInCurrentUrl('tenant-another');
  I.seeNumberOfElements('.tenant-details', 2);
});

Scenario('I see the tenant I did not delete on the tenant-another page', (
  I,
  tenantAddAnotherPage
) => {
  I.click('.tenant-details:first-of-type tr:nth-child(7) > td:nth-child(4) > a');
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
  I.seeNumberOfElements('.tenant-details', 1);
  I.see('Name bbb', 'table > tbody > tr:nth-child(1)');
  I.see('Date of birth 1981-02-02', 'table > tbody > tr:nth-child(2)');
  I.see('Country of nationality India', 'table > tbody > tr:nth-child(3)');
});

