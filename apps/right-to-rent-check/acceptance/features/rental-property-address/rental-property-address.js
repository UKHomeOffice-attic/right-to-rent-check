'use strict';

const steps = require('../../../');

Feature('Rental Property Address Page');

Before((
  I,
  rentalPropertyAddressPage
) => {
  I.visitPage(rentalPropertyAddressPage, steps);
});

Scenario('An error is shown if form is submitted without entering a postcode', (
  I,
  rentalPropertyAddressPage
) => {
  I.submitForm();
  I.seeErrors(rentalPropertyAddressPage.id.postcode);
});

Scenario('I am taken to the manual entry step if I click the manual link', (
  I,
  rentalPropertyAddressPage
) => {
  I.click(rentalPropertyAddressPage.id.manualLink);
  I.seeInCurrentUrl(rentalPropertyAddressPage.steps.manual);
});

Scenario('I see an error if I submit the manual step without entering an address', (
  I,
  rentalPropertyAddressPage
) => {
  I.click(rentalPropertyAddressPage.id.manualLink);
  I.submitForm();
  I.seeErrors(rentalPropertyAddressPage.id.address);
});

Scenario('I am taken to the landlord/agent page if I enter an address manually', (
  I,
  rentalPropertyAddressPage,
  personInPropertyPage
) => {
  I.click(rentalPropertyAddressPage.id.manualLink);
  I.fillField(rentalPropertyAddressPage.id.address, rentalPropertyAddressPage.content.address);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
});

Scenario('I see an error if I enter an invalid postcode', (
  I,
  rentalPropertyAddressPage
) => {
  I.fillField(rentalPropertyAddressPage.id.postcode, rentalPropertyAddressPage.content.invalidPostcode);
  I.submitForm();
  I.seeErrors(rentalPropertyAddressPage.id.postcode);
});

Scenario('I am taken to the lookup step on a successful postcode submission', (
  I,
  rentalPropertyAddressPage
) => {
  rentalPropertyAddressPage.enterValidPostcode();
  I.seeInCurrentUrl(rentalPropertyAddressPage.steps.lookup);
});

Scenario('I see an error if I click continue without selecting an option', (
  I,
  rentalPropertyAddressPage
) => {
  rentalPropertyAddressPage.enterValidPostcode();
  I.submitForm();
  I.seeErrors(rentalPropertyAddressPage.id.select);
});

Scenario('I am taken to the manual step if I click the cant-find link', (
  I,
  rentalPropertyAddressPage
) => {
  rentalPropertyAddressPage.enterValidPostcode();
  I.click(rentalPropertyAddressPage.id.cantFind);
  I.seeInCurrentUrl(rentalPropertyAddressPage.steps.manual);
});

Scenario('I am taken to the postcode step if I click change', (
  I,
  rentalPropertyAddressPage
) => {
  rentalPropertyAddressPage.enterValidPostcode();
  I.click(rentalPropertyAddressPage.id.change);
  I.seeInCurrentUrl(rentalPropertyAddressPage.steps.postcode);
});

Scenario('I am taken to the landlord/agent step if I select an address', (
  I,
  rentalPropertyAddressPage,
  personInPropertyPage
) => {
  rentalPropertyAddressPage.enterValidPostcode();
  I.selectOption(rentalPropertyAddressPage.id.select, rentalPropertyAddressPage.content.select);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
});
