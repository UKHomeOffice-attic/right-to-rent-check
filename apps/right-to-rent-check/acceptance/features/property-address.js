'use strict';

const steps = require('../../');

Feature('Rental Property Address Page');

Before((
  I,
  propertyAddressPage
) => {
  I.visitPage(propertyAddressPage, steps);
});

Scenario('An error is shown if form is submitted without entering a postcode', (
  I,
  propertyAddressPage
) => {
  I.submitForm();
  I.seeErrors(propertyAddressPage.id.postcode);
});

Scenario('I am taken to the manual entry step if I click the manual link', (
  I,
  propertyAddressPage
) => {
  I.click(propertyAddressPage.id.manualLink);
  I.seeInCurrentUrl(propertyAddressPage.steps.manual);
});

Scenario('I see an error if I submit the manual step without entering an address', (
  I,
  propertyAddressPage
) => {
  I.click(propertyAddressPage.id.manualLink);
  I.submitForm();
  I.seeErrors(propertyAddressPage.id.address);
});

Scenario('I am taken to the landlord/agent page if I enter an address manually', (
  I,
  propertyAddressPage,
  personInPropertyPage
) => {
  I.click(propertyAddressPage.id.manualLink);
  I.fillField(propertyAddressPage.id.address, propertyAddressPage.content.address);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  propertyAddressPage
) => {
  I.fillField(propertyAddressPage.id.postcode, propertyAddressPage.content.invalidPostcode);
  I.submitForm();
  I.seeErrors(propertyAddressPage.id.postcode);
});

Scenario('I am taken to the lookup step on a successful postcode submission', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.seeInCurrentUrl(propertyAddressPage.steps.lookup);
});

Scenario('I see an error if I click continue without selecting an option', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.submitForm();
  I.seeErrors(propertyAddressPage.id.select);
});

Scenario('I am taken to the manual step if I click the cant-find link', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.id.cantFind);
  I.seeInCurrentUrl(propertyAddressPage.steps.manual);
});

Scenario('I am taken to the postcode step if I click change', (
  I,
  propertyAddressPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.click(propertyAddressPage.id.change);
  I.seeInCurrentUrl(propertyAddressPage.steps.postcode);
});

Scenario('I am taken to the landlord/agent step if I select an address', (
  I,
  propertyAddressPage,
  personInPropertyPage
) => {
  propertyAddressPage.enterValidPostcode();
  I.selectOption(propertyAddressPage.id.select, propertyAddressPage.content.select);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
});
