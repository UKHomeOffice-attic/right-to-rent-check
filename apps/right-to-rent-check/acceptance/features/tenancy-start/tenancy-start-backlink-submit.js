'use strict';

Feature('Given I have submited a valid tenancy and I go back to the property address page');

Before((
  I,
  propertyAddressPage,
  personInPropertyPage,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.amOnPage(propertyAddressPage.url);
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
  I.click(checkConfirmedPage.backlink);
  I.seeInCurrentUrl(tenancyStartPage.url);
  I.click(tenancyStartPage.backlink);
  I.seeInCurrentUrl(personInPropertyPage.url);
  I.click(personInPropertyPage.backlink);
  I.seeInCurrentUrl(propertyAddressPage.url);
});

Scenario('When I submit a date between 1 Dec 2014 & 31st Jan 2016 & the postcode is NOT in the West Midlands Then I see an exit page', (
  I,
  tenancyStartPage,
  checkNotNeededDatePage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-address-postcode': 'SW1P 4DF',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(checkNotNeededDatePage.url);
});

Scenario('When I submit a date & the postcode is in the West Midlands Then I see the tenancy details page', (
  I,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
