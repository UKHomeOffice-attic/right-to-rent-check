'use strict';

const steps = require('../../../');

Feature('Given I am a landlord and the tenant is not in the property');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-current-address-postcode': 'CR0 2EU',
    'representative': 'landlord',
    'landlord-name': 'Johnny',
    'landlord-company': 'Johnny Corp',
    'landlord-email-address': 'johnny@corp.com',
    'landlord-phone-number': '1234567890'
  });
});

Scenario('When the page at /confirm loads then I should see their current address', (
  I
) => {
  I.see('CR0 2EU', 'tr[data-id=\'tenant-current-address\']');
});

Scenario('When the page at /confirm loads then I should see if they live in the UK', (
  I
) => {
  I.see('Yes', 'tr[data-id=\'tenant-in-uk\']');
});

Scenario('When the page at /confirm loads then I should not see the moving-in date', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'tenancy-start\']');
});

