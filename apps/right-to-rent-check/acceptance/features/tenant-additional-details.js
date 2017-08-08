'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Additional Details Page');

Before((
  I,
  tenantAdditionalDetailsPage
) => {
  I.visitPage(tenantAdditionalDetailsPage, steps);
});

Scenario('The correct fields are on the page', (
  I,
  tenantAdditionalDetailsPage
) => {
  I.seeElements(_.values(tenantAdditionalDetailsPage.fields));
});

Scenario('Hidden fields become visible when the fields are checked', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.seeElements(_.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('Hidden fields become visible when the fields are checked', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.seeElements(_.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('I see an error if I check a field and do not complete it\'s hidden field', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.submitForm();
  I.seeErrors(tenantAdditionalDetailsPage.hidden['reference-number']);
  I.seeErrors(tenantAdditionalDetailsPage.hidden['passport-number']);
  I.seeErrors(tenantAdditionalDetailsPage.hidden['brp-number']);
  I.seeErrors(tenantAdditionalDetailsPage.hidden['recorded-delivery-number']);
});

Scenario('I am taken to the tenant-another step if I do not complete or check any field', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});

Scenario('I am taken to the tenant-another step if I check a field and complete it\'s hidden field', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  I.click(tenantAdditionalDetailsPage.fields['brp-number']);
  I.fillField(tenantAdditionalDetailsPage.hidden['brp-number'], '0987654321')
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});

Scenario('I am taken to the tenant-another step if I check all fields and complete their hidden fields', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  tenantAdditionalDetailsPage.completeAllFields();
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});
