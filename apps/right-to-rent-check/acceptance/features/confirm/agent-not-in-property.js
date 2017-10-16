'use strict';

const steps = require('../../../');

Feature('Given I am an Agent and the tenant is not living in the property');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'current-property-address': 'ABC 222',
    'representative': 'agent',
    'agent-email-address': 'emma.ogrady@gmail.com'
  });
});

Scenario('When the page at /confirm loads then I should see the tenants current address', (
  I
) => {
  I.see('ABC 222', 'tr[data-id=\'current-property-address\']');
});

Scenario('When the page at /confirm loads then I should see the tenant lives in the UK', (
  I
) => {
  I.see('Yes', 'tr[data-id=\'tenant-in-uk\']');
});

Scenario('When the page at /confirm loads then I should not see the moving-in date', (
  I
) => {
  I.dontSeeElement('tr[data-id=\'tenancy-start\']');
});

