'use strict';

const steps = require('../../../');

Feature('Given I am on /rental-property-address');

Scenario('When I enter an address manually and enter a date between 1 Dec 2014 & 31st Jan 2016 Then I go to /check-confirmed', (
  I,
  rentalPropertyAddressPage,
  personInPropertyPage,
  checkConfirmedPage
) => {
  I.visitPage(rentalPropertyAddressPage, steps);
  I.click(rentalPropertyAddressPage.id.manualLink);
  I.fillField(rentalPropertyAddressPage.id.address, rentalPropertyAddressPage.content.address);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
  personInPropertyPage.selectYesAndSubmit();
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
