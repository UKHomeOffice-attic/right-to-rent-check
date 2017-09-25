'use strict';

const steps = require('../../');

Feature('Given I have added two tenants');

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
  I.submitForm();

  I.click('#tenant-add-another-yes');
  I.submitForm();

  I.fillField('tenant-name', 'bbb');
  I.fillField('tenant-dob-day', '2');
  I.fillField('tenant-dob-month', '2');
  I.fillField('tenant-dob-year', '1981');
  I.fillField('tenant-country', 'India');
  I.submitForm();
  I.submitForm();

  I.seeNumberOfElements('.tenant-details', 2);
});

Scenario('When I delete one of the tenants Then I am at /request-another-tenant', (
  I,
  requestAnotherTenantPage
) => {
  I.click('#delete-tenant-button');
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
});

Scenario('When I delete one of the tenants Then I see the tenant I did not delete', (
  I
) => {
  I.click('#delete-tenant-button');
  I.seeNumberOfElements('.tenant-details', 1);
  I.see('bbb', '#tenant-name');
  I.see('1981-02-02', '#tenant-dob');
  I.see('India', '#tenant-country');
});

Scenario('When I delete one of the tenants Then I do not see the tenant I deleted', (
  I
) => {
  I.click('#delete-tenant-button');
  I.seeNumberOfElements('.tenant-details', 1);
  I.dontSee('aaa', '#tenant-name');
  I.dontSee('1981-01-01', '#tenant-dob');
  I.dontSee('United Kingdom', '#tenant-country');
});

