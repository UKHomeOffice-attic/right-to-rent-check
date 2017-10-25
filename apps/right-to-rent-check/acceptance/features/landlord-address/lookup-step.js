'use strict';

const steps = require('../../../');
const config = require('../../../../../config');

Feature('Given I am on the Lookup step of the Landlord Address page');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
  I.fillField('#landlord-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
});

Scenario('When I select an address and submit then I am taken to /confirm', (
  I
) => {
  I.selectOption('#landlord-address-select', config.postcode.stub.address);
  I.submitForm();
  I.seeInCurrentUrl('confirm');
});

Scenario('When I do not select an address and submit then I see an error message', (
  I
) => {
  I.submitForm();
  I.seeErrors('#landlord-address-select');
});

Scenario('When I click the Can\'t find address link then I am taken to the manual entry page', (
  I
) => {
  I.click('.cant-find');
  I.seeInCurrentUrl('landlord-address?step=manual');
});
