'use strict';

const steps = require('../../');

Feature('Given I am at /check-confirmed');

Before((
  I
) => {
  I.amOnPage('/');
});

Scenario('When the page loads then the correct page elements are visible', (
  I,
  checkConfirmedPage
) => {
  I.visitPage(checkConfirmedPage, steps);
  I.seeElement('#checkAnswersTable');
  I.seeElement('a[href="/documents-check"]');
});

Scenario('When I click the link then I am taken to /documents-check', (
  I,
  checkConfirmedPage
) => {
  I.completeToStep(`/${checkConfirmedPage.url}`, {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'property-address-postcode': 'CR0 2EU',
    'property-address-select': '49 Sydenham Road, Croydon, CR0 2EU',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017'
  });
  I.click('a[href="/documents-check"]');
  I.seeInCurrentUrl('/documents-check');
});

Scenario('When I click the Continue button then I see the start page', (
  I,
  checkConfirmedPage
) => {
  I.visitPage(checkConfirmedPage, steps);
  I.click('input[type="submit"]');
  I.seeInCurrentUrl('/start');
});

Scenario.only('When the user is living in the property then the following tabular data is visible', (
  I,
  checkConfirmedPage
) => {
  I.completeToStep(`/${checkConfirmedPage.url}`, {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'property-address-postcode': 'CR0 2EU',
    'property-address-select': '49 Sydenham Road, Croydon, CR0 2EU',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017'
  });
  I.seeNumberOfElements('#checkAnswersTable tr', 5);
  I.see('Does the person have documents No', '#checkAnswersTable tr:nth-child(1)');
  I.see('Where is the rental property England', '#checkAnswersTable tr:nth-child(2)');
  I.see('What is the rental property address 49 Sydenham Road Croydon CR0 2EU', '#checkAnswersTable tr:nth-child(3)');
  I.see('Person(s) living in property Yes', '#checkAnswersTable tr:nth-child(4)');
  I.see('When did they move in 01-01-2017', '#checkAnswersTable tr:nth-child(5)');
});

Scenario('When the user is not living in the property then the following tabular data is visible', (
  I,
  checkConfirmedPage
) => {
  I.completeToStep(`/${checkConfirmedPage.url}`, {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'property-address-postcode': 'CR0 2EU',
    'property-address-select': '49 Sydenham Road, Croydon, CR0 2EU',
    'living-status': 'no',
    'tenant-in-uk': 'yes',
    'current-address-postcode': 'CR0 2EU',
    'current-address-select': '49 Sydenham Road, Croydon, CR0 2EU',
  });
  I.seeNumberOfElements('#checkAnswersTable tr', 6);
  I.see('Does the person have documents No', '#checkAnswersTable tr:nth-child(1)');
  I.see('Where is the rental property England', '#checkAnswersTable tr:nth-child(2)');
  I.see('What is the rental property address 49 Sydenham Road Croydon CR0 2EU', '#checkAnswersTable tr:nth-child(3)');
  I.see('Person(s) living in property No', '#checkAnswersTable tr:nth-child(4)');
  I.see('Person(s) living in UK Yes', '#checkAnswersTable tr:nth-child(5)');
  I.see('Current address 49 Sydenham Road Croydon CR0 2EU', '#checkAnswersTable tr:nth-child(6)');
});
