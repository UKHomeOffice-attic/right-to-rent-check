'use strict';

const steps = require('../../../');
const add = (n) => {
  return function () {
    if (n != 0) {
      n = n - 1
      return 'yes'
    }
    return 'no';
  }
};

Feature('Given I am an Agent');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'rental-property-address': 'CR0 2EU',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-current-address': 'CR0 2EU',
    'tenant-add-another': add(2),
    'representative': 'agent',
    'agent-company': 'abc corp',
    'agent-name': 'abc',
    'agent-email-address': 'abc@abc-corp.com',
    'agent-phone-number': '12345',
    'agent-address': 'CR0 2EU',
    'landlord-name': 'Johnny',
    'landlord-address-postcode': 'CR0 2EU'
  });
});

Scenario('When /confirm loads then I should see Tenant details for each tenant', (
  I
) => {
  I.seeInCurrentUrl('/confirm');
  I.seeNumberOfElements('table[data-section=\'tenant-details\']', 1);
  I.seeNumberOfElements('tbody[data-group=\'tenants\']', 2);

  I.seeNumberOfElements('tr[data-id=\'tenant-name\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-dob\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-country\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-reference-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-passport-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-brp-number\']', 2);
  I.seeNumberOfElements('tr[data-id=\'tenant-recorded-delivery-number\']', 2);
});

Scenario('When /confirm loads then I should see the Agent Details', (
  I
) => {
  I.seeInCurrentUrl('/confirm');
  I.seeNumberOfElements('table[data-section=\'agent-details\']', 1);
  I.see('abc corp', 'tr[data-id=\'agent-company\']');
  I.see('abc', 'tr[data-id=\'agent-name\']');
  I.see('abc@abc-corp.com', 'tr[data-id=\'agent-email-address\']');
  I.see('12345', 'tr[data-id=\'agent-phone-number\']');
  I.see('CR0 2EU', 'tr[data-id=\'agent-address\']');
});

Scenario('When /confirm loads then I should see the Landlord Details', (
  I
) => {
  I.seeInCurrentUrl('/confirm');
  I.seeNumberOfElements('table[data-section=\'landlord-details\']', 1);
  I.see('Johnny', 'tr[data-id=\'landlord-name\']');
  I.see('CR0 2EU', 'tr[data-id=\'landlord-address\']');
});

Scenario('When /confirm loads then I should see the Key Details', (
  I
) => {
  I.seeNumberOfElements('table[data-section=\'key-details\']', 1);
  I.see('No', 'tr[data-id=\'documents-check\']');
  I.see('England', 'tr[data-id=\'rental-property-location\']');
  I.see('CR0 2EU', 'tr[data-id=\'rental-property-address\']');
  I.see('No', 'tr[data-id=\'living-status\']');
  I.see('Yes', 'tr[data-id=\'tenant-in-uk\']');
  I.see('CR0 2EU', 'tr[data-id=\'tenant-current-address\']');
});

Scenario('When the Key Details load then they should not be edittable', (
  I
) => {
  I.seeNumberOfElements('table[data-section=\'key-details\']', 1);
  I.dontSee('Change', 'tr[data-id=\'documents-check\']');
  I.dontSee('Change', 'tr[data-id=\'rental-property-location\']');
  I.dontSee('Change', 'tr[data-id=\'rental-property-address\']');
  I.dontSee('Change', 'tr[data-id=\'living-status\']');
  I.dontSee('Change', 'tr[data-id=\'tenant-in-uk\']');
  I.dontSee('Change', 'tr[data-id=\'tenant-current-address\']');
});

Scenario('When I click Continue then I am taken to /declaration', (
  I
) => {
  I.click('[type=\'submit\']');
  I.seeInCurrentUrl('/declaration');
});
