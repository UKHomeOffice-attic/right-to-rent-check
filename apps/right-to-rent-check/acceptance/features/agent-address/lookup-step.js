'use strict';

const steps = require('../../../');
const config = require('../../../../../config');

Feature('Given I am on the Lookup step of the Agent Address page');

Before((
  I,
  agentAddressPage
) => {
  I.visitPage(agentAddressPage, steps);
  I.fillField('#agent-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
});

Scenario('When I select an address and submit then I am taken to /landlord-name', (
  I
) => {
  I.selectOption('#agent-address-select', config.postcode.stub.address);
  I.submitForm();
  I.seeInCurrentUrl('landlord-name');
});

Scenario('When I do not select an address and submit then I see an error message', (
  I
) => {
  I.submitForm();
  I.seeErrors('#agent-address-select');
});

Scenario('When I click the Can\'t find address link then I am taken to the manual entry page', (
  I
) => {
  I.click('.cant-find');
  I.seeInCurrentUrl('agent-address?step=manual');
});
