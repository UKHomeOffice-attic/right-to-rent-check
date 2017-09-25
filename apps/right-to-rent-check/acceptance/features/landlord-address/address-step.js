'use strict';

const steps = require('../../../');
const config = require('../../../../../config');
const unknownPostcode = 'TN39TT';

Feature('Given I am on the Address step of the Landlord Address page');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
  I.fillField('#landlord-address-postcode', unknownPostcode);
  I.submitForm();
});

Scenario('When the address step loads then the change postcode link is visible', (
  I
) => {
  I.seeNumberOfElements('.change-postcode', 1);
});

Scenario('When I click the Change postcode link then I am taken to the postcode step', (
  I
) => {
  I.click('.change-postcode');
  I.seeInCurrentUrl('?step=postcode');
});

Scenario('When the address step loads then the postcode I entered is visible', (
  I
) => {
  I.see(unknownPostcode, 'span.postcode');
});

Scenario('When I do not enter an address and submit then I see an error', (
  I
) => {
  I.submitForm();
  I.seeErrors('#landlord-address-group');
});

Scenario('When I submit an address then I am redirected to /confirm', (
  I
) => {
  I.fillField('#landlord-address', 'My address');
  I.submitForm();
  I.seeInCurrentUrl('confirm');
});
