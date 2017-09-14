'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Given I have added one tenant and /request-another-tenant loads');

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
  I.click('#tenant-additional-details-brp-number');
  I.fillField('#tenant-brp-number', '0987654321');
  I.submitForm();
});

Scenario('When the page loads Then the correct fields are visible', (
  I,
  requestAnotherTenantPage
) => {
  I.seeElements(_.values(requestAnotherTenantPage.fields));
});

Scenario('When the tenants become visible Then one tenant is visible', (
  I
) => {
  I.seeNumberOfElements('.tenant-details', 1);
});

Scenario('When the tenant details become visible Then a change button is visible next to each tenant detail', (
  I
) => {
  I.seeNumberOfElements('.change-tenant-button', 7);
  I.seeNumberOfElements('.tenant-details', 1);
});

Scenario('When I submit the form Then I see an error', (
  I
) => {
  I.submitForm();
  I.seeErrors('#tenant-add-another-group');
});

Scenario('When I select yes and submit the form Then I am taken to /tenant-details', (
  I,
  tenantDetailsPage
) => {
  I.checkOption('#tenant-add-another-yes');
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('When I select yes and submit the form Then all fields are empty on /tenant-details', (
  I
) => {
  I.checkOption('#tenant-add-another-yes');
  I.submitForm();
  I.seeInField('#tenant-name', '');
  I.seeInField('#tenant-dob-day', '');
  I.seeInField('#tenant-dob-month', '');
  I.seeInField('#tenant-dob-year', '');
  I.seeInField('#tenant-country', '');
});

Scenario('When I select no and submit the form Then I am taken to /landlord-agent', (
  I,
  requestAnotherTenantPage,
  landlordAgentPage
) => {
  I.checkOption('#tenant-add-another-no');
  I.submitForm();
  I.seeInCurrentUrl(landlordAgentPage.url);
});

Scenario('When I click the back link Then I am redirected to /tenant-additonal-details', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.backLink);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
});

Scenario('When I click the back link And submit /tenant-additonal-details Then I see the same tenant details', (
  I,
  requestAnotherTenantPage
) => {
  I.click(requestAnotherTenantPage.selectors.backLink);
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
  I.seeNumberOfElements('.tenant-details', 1);
  I.see('aaa', '#tenant-name');
  I.see('1980-01-01', '#tenant-dob');
  I.see('United Kingdom', '#tenant-country');
  I.see('0987654321', '#brp-number');
});

Scenario('When I click the back link And and submit with a new BRP number Then I see the same tenant with a new BRP number', (
  I,
  requestAnotherTenantPage
) => {
  I.click(requestAnotherTenantPage.selectors.backLink);
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
  I.seeNumberOfElements('.tenant-details', 1);
  I.see('aaa', '#tenant-name');
  I.see('1980-01-01', '#tenant-dob');
  I.see('United Kingdom', '#tenant-country');
  I.see('0987654321', '#brp-number');
});

Scenario('When I delete the tenant Then I am redirected to /tenant-details', (
  I,
  tenantDetailsPage
) => {
  I.seeInCurrentUrl('/request-another-tenant');
  I.click('#delete-tenant-button');
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('When I delete the tenant Then all fields are empty at /tenant-details', (
  I
) => {
  I.click('#delete-tenant-button');
  I.seeInField('tenant-name', '');
  I.seeInField('tenant-dob-day', '');
  I.seeInField('tenant-dob-month', '');
  I.seeInField('tenant-dob-year', '');
  I.seeInField('tenant-country', '');
});

Scenario('When I delete the tenant And submit a valid form at /tenant-details Then I am redirected to /tenant-additional-details', (
  I,
  requestAnotherTenantPage,
  tenantDetailsPage,
  tenantAdditionalDetailsPage
) => {
  I.click('#delete-tenant-button');
  I.fillField('tenant-name', 'bbb');
  I.fillField('tenant-dob-day', '2');
  I.fillField('tenant-dob-month', '2');
  I.fillField('tenant-dob-year', '1965');
  I.fillField('tenant-country', 'Uganda');

  I.submitForm();
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
});

Scenario('When I click the change Name button Then I see the Name I entered at /tenant-details', (
  I,
  requestAnotherTenantPage,
  tenantDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.name);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInField('#tenant-name', 'aaa');
});

Scenario('When I click the change Date of Birth button Then I see the DOB I entered at /tenant-details', (
  I,
  requestAnotherTenantPage,
  tenantDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.dob);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInField('#tenant-dob-day', '1');
  I.seeInField('#tenant-dob-month', '1');
  I.seeInField('#tenant-dob-year', '1980');
});

Scenario('When I click the change Country of Nationality button Then I see the Country I entered at /tenant-details', (
  I,
  requestAnotherTenantPage,
  tenantDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.country);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.seeInField('#tenant-country', 'United Kingdom');
});

Scenario('When I click the change Home Office reference number button Then I see an empty HO reference number at /tenant-additional-details', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.reference);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInField('#tenant-reference-number', '');
});

Scenario('When I click the change Passport number button Then I see an empty Passport number at /tenant-additional-details', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.passport);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInField('#tenant-passport-number', '');
});

Scenario('When I click the change BRP number button Then I see the BRP number I entered at /tenant-additional-details', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.brp);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInField('#tenant-brp-number', '0987654321');
});

Scenario('When I click the change Recorded delivery reference number button Then I see the Delivery number I entered at /tenant-additional-details', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.delivery);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.seeInField('#tenant-recorded-delivery-number', '');
});

Scenario('When I edit the tenants\' Name  And submit Then I see the Name I editted at /request-another-tenant', (
  I,
  requestAnotherTenantPage,
  tenantDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.name);
  I.seeInCurrentUrl(tenantDetailsPage.url);
  I.fillField('#tenant-name', 'bar');
  I.fillField('#tenant-dob-year', '1981');
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
  I.see('bar');
  I.see('1981');
});

Scenario('When I edit the tenants\' BRP number And submit Then I see the BRP number I editted at /request-another-tenant', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.brp);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.fillField('#tenant-brp-number', '123456789');
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
  I.see('123456789');
});

Scenario('When I uncheck the tenants\' Passport number checkbox And submit Then I don\'t see the Passport number I entered at /request-another-tenant', (
  I,
  requestAnotherTenantPage,
  tenantAdditionalDetailsPage
) => {
  I.click(requestAnotherTenantPage.selectors.change.passport);
  I.seeInCurrentUrl(tenantAdditionalDetailsPage.url);
  I.click('#tenant-additional-details-passport-number');
  I.fillField('#tenant-passport-number', '0000000000');
  I.click('#tenant-additional-details-passport-number');
  I.submitForm();
  I.seeInCurrentUrl(requestAnotherTenantPage.url);
  I.dontSee('0000000000');
});
