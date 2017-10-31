'use strict';

const steps = require('../../../');

Feature('Given I am an Agent and the tenant is living in the property');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017',
    'representative': 'agent',
    'agent-company': 'abc corp',
    'agent-name': 'abc',
    'agent-email-address': 'abc@abc-corp.com',
    'agent-phone-number': '12345',
    'agent-address': 'CR0 2EU',
    'landlord-address-postcode': 'CR0 2EU'
  });
});


Scenario('When the page loads at /confirm then I should see the start date', (
  I
) => {
  I.see('2017-01-01', 'tr[data-id=\'tenancy-start\']');
});

Scenario('When the page loads at /confirm then I should not see their current address', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'tenant-current-address\']');
});

Scenario('When the page loads at /confirm then I should not see if they live in the UK', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'tenant-in-uk\']');
});

