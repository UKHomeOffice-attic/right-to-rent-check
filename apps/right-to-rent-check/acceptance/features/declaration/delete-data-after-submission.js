'use strict';

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
    'tenant-current-address-postcode': 'CR0 2EU',
    'tenant-name': 'qwertyuiopasdfghjkl',
    'tenant-add-another': 'no',
    'representative': 'agent',
    'agent-company': 'abc corp',
    'agent-name': 'abc',
    'agent-email-address': 'abc@abc-corp.com',
    'agent-phone-number': '12345',
    'agent-address': 'CR0 2EU',
    'landlord-address-postcode': 'CR0 2EU'
  });
});

// bugfix- data is deleted after the first submission
Scenario('I complete a submission the first time and I go through the form again, I do not see the same data', (
  I
) => {
  I.seeInCurrentUrl('/declaration');
  I.click('[type=\'submit\']');
  I.seeInCurrentUrl('/confirmation');
  I.click('a[href="/eligibility-check"]')
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-add-another': 'no',
    'representative': 'landlord',
    'landlord-address': 'CR0 2EU'
  });
  I.dontSee('qwertyuiopasdfghjkl', 'tr[data-id=\'tenant-name\']');
});
