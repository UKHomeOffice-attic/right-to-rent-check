'use strict';

const steps = require('../../../');

Feature('Given I have completed to /confirm with one tenant and no documents');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'CR0 2EU',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-add-another': 'no',
    'tenant-dob-day': '1',
    'tenant-dob-month': '1',
    'tenant-dob-year': '1990',
    'tenant-additional-details': null
  });
});

Scenario('When I edit to add a document then details are preserved', (
  I
) => {
  // data is visible
  I.see('Not provided', 'tr[data-id=\'tenant-reference-number\']');
  I.see('Not provided', 'tr[data-id=\'tenant-passport-number\']');
  I.see('Not provided', 'tr[data-id=\'tenant-brp-number\']');
  I.see('Not provided', 'tr[data-id=\'tenant-recorded-delivery-number\']');
  I.see('01-01-1990', 'tr[data-id=\'tenant-dob\']')

  // go back to edit reference number
  I.click('#tenant-reference-number-change');

  // add a reference number
  I.click('#tenant-additional-details-reference-number');
  I.fillField('#tenant-reference-number', '0123456789');
  // continue
  I.click('input[type="submit"]');

  // I am returned to confirm page
  I.seeInCurrentUrl('/confirm');
  // reference number is updated
  I.see('0123456789', 'tr[data-id=\'tenant-reference-number\']');
  // dob is preserved (bugfix)
  I.see('01-01-1990', 'tr[data-id=\'tenant-dob\']');
});

