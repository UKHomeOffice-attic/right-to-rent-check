'use strict';

Feature('Given I have completed to /confirm as a landlord');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/confirm', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenant-add-another': 'no',
    'representative': 'landlord',
    'landlord-address-postcode': 'A1 1AA', // a postcode that will trigger manual entry
    'landlord-address': '1 High Street'
  });
});

Scenario('When I edit my address manually the data is preserved (bugfix)', (
  I
) => {
  I.click('#landlord-address-change');
  I.click('a[href*="step=manual"]');
  I.see('1 High Street');
});
