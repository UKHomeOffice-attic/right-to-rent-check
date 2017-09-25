'use strict';

Feature('Given I am on /person-in-property');

Before((
  I
) => {
  I.amOnPage('/');
});

Scenario('When I select yes and go through the form to /request-another-tenant Then I see specific content on ', (
  I
) => {
  I.completeToStep('/request-another-tenant', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017',
    'tenant-dob-year': '1980',
    'tenant-country': 'Afghanistan'
  });
  I.seeElement('#yes-living-status');
  I.dontSeeElement('#no-living-status');
});

Scenario('When I select no and go through the form to /request-another-tenant Then I see the tenant-name in the header', (
  I
) => {
  I.completeToStep('/request-another-tenant', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'tenancy-start-year': '2017',
    'tenant-name': 'Yusef Estes',
    'tenant-dob-year': '1980',
    'tenant-country': 'Afghanistan'
  });
  I.see('Yusef Estes', '#no-living-status');
  I.dontSeeElement('#yes-living-status');
});
