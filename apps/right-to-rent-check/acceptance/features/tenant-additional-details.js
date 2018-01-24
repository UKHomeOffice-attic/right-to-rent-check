'use strict';

Feature('Given I am at /tenant-additional-details');

Before((
  I,
  tenantAdditionalDetailsPage
) => {
  I.amOnPage('/');
  I.completeToStep(tenantAdditionalDetailsPage.url, {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017'
  });
});

// Scenario('When the page loads Then the correct fields are visible', (
//   I,
//   tenantAdditionalDetailsPage
// ) => {
//   I.seeElements(Object.values(tenantAdditionalDetailsPage.fields));
// });

Scenario('When a visible field is checked Then its hidden field becomes visible', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.seeElements(Object.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('When a field is visible and empty And I submit the form Then I see errors', (
  I,
  tenantAdditionalDetailsPage
) => {
  tenantAdditionalDetailsPage.checkFields();
  I.submitForm();
  I.seeErrors(Object.values(tenantAdditionalDetailsPage.hidden));
});

Scenario('When all fields are empty And I submit the form Then I am redirected to /request-another-tenant', (
  I,
  tenantAdditionalDetailsPage,
  requestAnotherTenantPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
});

Scenario('When I check a field and complete it\'s hidden field Then I am redirected to /request-another-tenant', (
  I,
  tenantAdditionalDetailsPage,
  requestAnotherTenantPage
) => {
  I.click('#tenant-additional-details-brp-number');
  I.fillField('#tenant-brp-number', '0987654321');
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
});

Scenario('When I check all fields and complete their hidden fields Then I am redirected to /request-another-tenant', (
  I,
  tenantAdditionalDetailsPage,
  requestAnotherTenantPage
) => {
  tenantAdditionalDetailsPage.completeAllFields();
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
});

Scenario('Deleting a tenant, and then adding another will have checkboxes unchecked (Bugfix)', (
  I,
  tenantAdditionalDetailsPage
) => {
  // GIVEN I have added two tenants with all checkboxes selected
  tenantAdditionalDetailsPage.completeAllFields();
  I.submitForm();
  I.completeToStep(tenantAdditionalDetailsPage.url, { 'tenant-add-another': 'yes' });
  tenantAdditionalDetailsPage.completeAllFields();
  I.submitForm();

  // AND I delete a tenant
  I.click('.tenant-details a.button-delete');

  // WHEN I add another tenant
  I.completeToStep(tenantAdditionalDetailsPage.url, { 'tenant-add-another': 'yes' });

  // THEN no additional details checkboxes are selected
  Object.values(tenantAdditionalDetailsPage.fields).forEach(field => {
    I.dontSeeCheckboxIsChecked(field);
  });
});

