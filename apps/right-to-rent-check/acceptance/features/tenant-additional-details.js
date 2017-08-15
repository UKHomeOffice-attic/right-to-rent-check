'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Given I am at /tenant-additional-details');

Before((
  I,
  tenantAdditionalDetailsPage
) => {
  I.visitPage(tenantAdditionalDetailsPage, steps);
});

Scenario('When the page loads Then the correct fields are visible', (
  I,
  tenantAdditionalDetailsPage
) => {
  I.seeElements(_.values(tenantAdditionalDetailsPage.fields));
});

Scenario('When a visible field is checked Then its hidden field becomes visible', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.seeElements(_.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('When a field is visible and empty And I submit the form Then I see errors', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.submitForm();
  I.seeErrors(_.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('When all fields are empty And I submit the form Then I am redirected to /tenant-another', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});

Scenario('When I check a field and complete it\'s hidden field Then I am redirected to /tenant-another', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  I.click('#tenant-additional-details-brp-number');
  I.fillField('#tenant-brp-number', '0987654321');
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});

Scenario('When I check all fields and complete their hidden fields Then I am redirected to /tenant-another', (
  I,
  tenantAdditionalDetailsPage,
  tenantAddAnotherPage
) => {
  tenantAdditionalDetailsPage.completeAllFields();
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
});
