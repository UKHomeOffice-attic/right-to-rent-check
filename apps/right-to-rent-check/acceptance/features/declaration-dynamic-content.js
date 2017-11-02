'use strict';

const steps = require('../../');
const config = require('../../../../config');

Feature('Given I am on /landlord-or-agent');

Before((
  I,
  landlordAgentPage
) => {
  I.visitPage(landlordAgentPage, steps);
});

Scenario('When I select landlord and go through the landlord part of the form Then I see the landlord content on /declaration', (
  I
) => {
  I.seeInCurrentUrl('landlord-or-agent');
  I.click('#representative-landlord');
  I.submitForm();
  I.seeInCurrentUrl('/landlord-details');
  I.fillField('#landlord-name', 'J');
  I.fillField('#landlord-email-address', 'a@g.com');
  I.fillField('#landlord-phone-number', '0123');

  I.submitForm();

  I.seeInCurrentUrl('landlord-address');
  I.fillField('#landlord-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
  I.selectOption('#landlord-address-select', config.postcode.stub.address);

  I.submitForm();

  I.seeInCurrentUrl('confirm');
  I.submitForm();
  I.seeInCurrentUrl('declaration');
  I.seeElement('#landlord');
  I.see('a@g.com');
});

Scenario('When I select agent and go through the agent part of the form Then I see the agent content on /declaration', (
  I
) => {
  I.seeInCurrentUrl('landlord-or-agent');
  I.click('#representative-agent');
  I.submitForm();
  I.seeInCurrentUrl('/agent-details');
  I.fillField('#agent-company', 'Agents Ltd');
  I.fillField('#agent-name', 'Agents R Us');
  I.fillField('#agent-email-address', 'b@g.com');
  I.fillField('#agent-phone-number', '0123');
  I.submitForm();

  I.seeInCurrentUrl('agent-address');
  I.fillField('#agent-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
  I.seeInCurrentUrl('agent-address?step=lookup');
  I.selectOption('#agent-address-select', config.postcode.stub.address);
  I.submitForm();

  I.seeInCurrentUrl('landlord-name');
  I.fillField('#landlord-name', 'Bruce Wayne');
  I.submitForm();
  I.seeInCurrentUrl('landlord-address');
  I.fillField('#landlord-address-postcode', config.postcode.stub.postcode);
  I.submitForm();
  I.selectOption('#landlord-address-select', config.postcode.stub.address);
  I.submitForm();
  I.seeInCurrentUrl('confirm');
  I.submitForm();
  I.seeInCurrentUrl('declaration');
  I.seeElement('#agent');
  I.see('b@g.com');
});
