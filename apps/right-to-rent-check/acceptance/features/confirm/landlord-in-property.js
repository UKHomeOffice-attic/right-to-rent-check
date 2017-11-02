'use strict';

const steps = require('../../../');

Feature('Given I am a landlord and the tenant is in the property');

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
    'representative': 'landlord',
    'landlord-name': 'Johnny',
    'landlord-company': 'Johnny Corp',
    'landlord-email-address': 'johnny@corp.com',
    'landlord-phone-number': '1234567890'
  });
});

Scenario('When the page loads at /confirm then I should see the start date', (
  I
) => {
  I.see('01-01-2017', 'tr[data-id=\'tenancy-start\']');
});

Scenario('When the page loads at /confirm then I should not see their current address', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'current-property-address\']');
});

Scenario('When the page loads at /confirm then I should not see if they live in the UK', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'tenant-in-uk\']');
});


