'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Details Page');

Before((
  I,
  tenantDetailsPage
) => {
  I.visitPage(tenantDetailsPage, steps);
});

Scenario('The correct fields are on the page', (
  I,
  tenantDetailsPage
) => {
  I.seeElements(_.values(tenantDetailsPage.fields));
});

Scenario('I see an error for each field if I submit without completing any of the fields', (
  I,
  tenantDetailsPage
) => {
  I.submitForm();
  I.seeErrors(tenantDetailsPage.fields.name);
  I.seeErrors(tenantDetailsPage.fields.country);
  I.seeErrors(tenantDetailsPage.fields.date);
});

Scenario('I see an error if I submit an invalid date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterDate('invalid');
  I.submitForm();
  I.seeErrors(tenantDetailsPage.fields.date);
});

Scenario('I see an error if I enter a future date', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterDate('future');
  I.submitForm();
  I.seeErrors(tenantDetailsPage.fields.date);
});

Scenario('I see an error if I do not select a country from the drop down', (
  I,
  tenantDetailsPage
) => {
  tenantDetailsPage.enterCountry('no country');
  I.submitForm();
  I.seeErrors(tenantDetailsPage.fields.country);
});

Scenario('I am taken to the tenant-additional-details step if I enter a valid date', (
  I,
  tenantDetailsPage,
  tenantAdditionalDetailsPage
) => {
  I.fillField(tenantDetailsPage.fields.name, tenantDetailsPage.content.name);
  I.fillField(tenantDetailsPage.fields.country, tenantDetailsPage.content.country);
  tenantDetailsPage.enterDate('valid');
  I.submitForm();
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
});
