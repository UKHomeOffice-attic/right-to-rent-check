'use strict';

const steps = require('../../../');
const config = require('../../../../../config');
const backLink = '#step a';

Feature('Given I am on /rental-property-address');

Before((
  I,
  rentalPropertyAddressPage
) => {
  I.visitPage(rentalPropertyAddressPage, steps);
});

Scenario('I go to manual address step And click the backLink Then I am on /rental-property-address', (
  I
) => {
  I.click("a[href='?step=manual']");
  I.seeInCurrentUrl('/rental-property-address?step=manual');
  I.click(backLink);
  I.seeInCurrentUrl('rental-property-address');
});

Scenario('I go to lookup step And click the backLink Then I am on /rental-property-address', (
  I
) => {
  I.fillField('#rental-property-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
  I.seeInCurrentUrl('/rental-property-address?step=lookup');
  I.click(backLink);
  I.seeInCurrentUrl('rental-property-address');
});

Scenario('I go to address step And click the backLink Then I am on /rental-property-address', (
  I
) => {
  I.fillField('#rental-property-address-postcode', 'N159LP');
  I.submitForm();
  I.seeInCurrentUrl('/rental-property-address?step=address');
  I.submitForm();
  I.click(backLink);
  I.seeInCurrentUrl('rental-property-address');
});
