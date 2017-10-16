'use strict';

const _ = require('lodash');

Feature('Given I am on the Tenancy Start Page');

Before((
  I,
  propertyAddressPage
) => {
  I.amOnPage(propertyAddressPage.url);
});

Scenario('The correct fields are on the page', (
  I,
  tenancyStartPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'living-status': 'yes'});
  I.seeElements(_.values(tenancyStartPage.fields));
});

Scenario('I see an error if I submit without completing the fields', (
  I,
  tenancyStartPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'living-status': 'yes'});
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I see an error if I enter an invalid date', (
  I,
  tenancyStartPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'living-status': 'yes'});
  tenancyStartPage.enterDate('invalid');
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I see an error if I enter a future date', (
  I,
  tenancyStartPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'living-status': 'yes'});
  tenancyStartPage.enterDate('future');
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I go to the exit page when I enter a date before the 1 Dec 2014', (
  I,
  tenancyStartPage,
  checkNotNeededDatePage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2013');
  I.submitForm();
  I.seeInCurrentUrl(checkNotNeededDatePage.url);
});

Scenario('I see an exit page when I enter a date between 1 Dec 2014 & 31st Jan 2016 & the postcode is not in the West Midlands', (
  I,
  tenancyStartPage,
  checkNotNeededDatePage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'SW1P 4DF',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(checkNotNeededDatePage.url);
});

Scenario('When I submit a valid date Then I am taken to the check confirmed page', (
  I,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});

Scenario('I can go to the next step when I enter a date after 31st Jan 2016, that is not in the future & the postcode IS NOT in the the West Midlands', (
  I,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'SW1P 4DF',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});

Scenario('I can go to the next step when I enter a date after 31st Jan 2016, that is not in the future & the postcode IS IN the West Midlands', (
  I,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.completeToStep(`/${tenancyStartPage.url}`, {
    'rental-property-location': 'england',
    'rental-property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
