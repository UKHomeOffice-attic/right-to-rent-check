'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Given I am at /tenant-details');

Before((
  I,
  tenantDetailsPage
) => {
  I.visitPage(tenantDetailsPage, steps);
});

Scenario('Then the correct fields are on the page', (
  I,
  tenantDetailsPage
) => {
  I.seeElements(_.values(tenantDetailsPage.fields));
});

Scenario('When I submit an empty form then I see an error for each field', (
  I
) => {
  I.submitForm();
  I.seeErrors('#tenant-name');
  I.seeErrors('#tenant-country');
  I.seeErrors('#tenant-dob-group');
});

Scenario('When I submit an invalid date then I see an invalid date error', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterDate('invalid');
  I.submitForm();
  I.seeErrors('#tenant-dob-group');
});

Scenario('When I submit a date in the future then I see a future date error', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterDate('future');
  I.submitForm();
  I.seeErrors('#tenant-dob-group');
});

Scenario('When I submit a date of birth that is less than 18 years then I see a age restriction error', (
  I,
  tenantDetailsPage
) => {
  I.fillField('#tenant-name', 'aaa');
  I.fillField('#tenant-country', 'United Kingdom');
  tenantDetailsPage.enterDate('underage');
  I.submitForm();
  I.seeErrors('#tenant-dob-group');
});

Scenario('When I submit an invalid country name then I see a country error', (
  I
) => {
  I.fillField('#tenant-country', 'Not a country');
  I.submitForm();
  I.seeErrors('#tenant-country');
});

Scenario('When I submit a valid form then I am taken to the tenant-additional-details', (
  I,
  tenantDetailsPage,
  tenantAdditionalDetailsPage
) => {
  I.fillField('#tenant-name', 'aaa');
  I.fillField('#tenant-country', 'United Kingdom');
  tenantDetailsPage.enterDate('valid');
  I.submitForm();
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
});
