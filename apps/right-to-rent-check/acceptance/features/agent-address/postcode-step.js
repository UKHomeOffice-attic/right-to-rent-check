'use strict';

const steps = require('../../../');
const config = require('../../../../../config');
const unknownPostcode = 'TN39TT';
const invalidPostcode = '123';
const emptyPostcode = '';

Feature('Given I am on the Agent Address page');

Before((
  I,
  agentAddressPage
) => {
  I.visitPage(agentAddressPage, steps);
});

Scenario('When I click the Manually Address link then I am directed to enter my address on the manual step', (
  I
) => {
  I.click('a[href="?step=manual"]')
  I.seeInCurrentUrl('agent-address?step=manual');
});

Scenario('When I submit a valid postcode then I am directed to select my address from the lookup step', (
  I
) => {
  I.fillField('#agent-address-postcode', config.mocks.postcode);
  I.submitForm();
  I.seeInCurrentUrl('agent-address?step=lookup');
});

Scenario('When I submit an Unkown postcode then I am directed to enter my address on the address step', (
  I
) => {
  I.fillField('#agent-address-postcode', unknownPostcode);
  I.submitForm();
  I.seeInCurrentUrl('agent-address?step=address');
});

Scenario('When I submit an Invalid postcode then I see a postcode error message', (
  I
) => {
  I.fillField('#agent-address-postcode', invalidPostcode);
  I.submitForm();
  I.seeInCurrentUrl('agent-address?step=postcode');
  I.seeErrors('#agent-address-postcode');
});

Scenario('When I submit an Empty postcode then I see a postcode error message', (
  I
) => {
  I.fillField('#agent-address-postcode', emptyPostcode);
  I.submitForm();
  I.seeInCurrentUrl('agent-address?step=postcode');
  I.seeErrors('#agent-address-postcode');
});

