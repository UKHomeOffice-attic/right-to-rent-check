'use strict';

const steps = require('../../../');

Feature('Given I am on /rental-property-address');

Scenario('When I enter an address manually and enter a date between 1 Dec 2014 & 31st Jan 2016 Then I go to /check-confirmed', (
  I,
  propertyAddressPage,
  personInPropertyPage,
  checkConfirmedPage
) => {
  I.visitPage(propertyAddressPage, steps);
  I.click(propertyAddressPage.id.manualLink);
  I.fillField(propertyAddressPage.id.address, propertyAddressPage.content.address);
  I.submitForm();
  I.seeInCurrentUrl(personInPropertyPage.url);
  personInPropertyPage.selectYesAndSubmit();
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
