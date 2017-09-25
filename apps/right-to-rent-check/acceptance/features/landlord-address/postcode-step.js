'use strict';

const steps = require('../../../');
const config = require('../../../../../config');
const unknownPostcode = 'TN39TT';
const invalidPostcode = '123';
const emptyPostcode = '';

Feature('Given I am on the Postcode step of the Landlord Address page');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
});

Scenario('When I click the Manually Address link then I am directed to enter my address on the manual step', (
  I
) => {
  I.click('a[href="?step=manual"]')
  I.seeInCurrentUrl('landlord-address?step=manual');
});

Scenario('When I submit a valid postcode then I am directed to select my address from the lookup step', (
  I
) => {
  I.fillField('#landlord-address-postcode', config.mocks.postcode);
  I.submitForm();
  I.seeInCurrentUrl('landlord-address?step=lookup');
});

Scenario('When I submit an Unkown postcode then I am directed to enter my address on the address step', (
  I
) => {
  I.fillField('#landlord-address-postcode', unknownPostcode);
  I.submitForm();
  I.seeInCurrentUrl('landlord-address?step=address');
});

Scenario('When I submit an Invalid postcode then I see a postcode error message', (
  I
) => {
  I.fillField('#landlord-address-postcode', invalidPostcode);
  I.submitForm();
  I.seeInCurrentUrl('landlord-address?step=postcode');
  I.seeErrors('#landlord-address-postcode');
});

Scenario('When I submit an Empty postcode then I see a postcode error message', (
  I
) => {
  I.fillField('#landlord-address-postcode', emptyPostcode);
  I.submitForm();
  I.seeInCurrentUrl('landlord-address?step=postcode');
  I.seeErrors('#landlord-address-postcode');
});

