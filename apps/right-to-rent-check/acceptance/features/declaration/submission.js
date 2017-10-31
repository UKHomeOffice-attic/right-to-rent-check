'use strict';

const add = (n) => {
  return function () {
    if (n != 0) {
      n = n - 1
      return 'yes'
    }
    return 'no';
  }
};

Feature('Given the page at /declaration has loaded');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/declaration', {
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
    'landlord-address-postcode': 'CR0 2EU'
  });
});

Scenario('When I submit the page then I am taken to /confirmation', (
  I
) => {
  I.click('[type=\'submit\']');
  I.seeInCurrentUrl('/confirmation');
});
