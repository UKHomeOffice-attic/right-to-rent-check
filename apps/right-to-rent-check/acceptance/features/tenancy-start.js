'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenancy Start Page');

Before((
  I
) => {
  I.amOnPage('/');
});

Scenario('The correct fields are on the page', (
  I,
  tenancyStartPage
) => {
  I.completeToStep('/tenancy-start', {
    'living-status': 'yes'});
  I.seeElements(_.values(tenancyStartPage.fields));
});

Scenario('I see an error if I submit without completing the fields', (
  I,
  tenancyStartPage
) => {
  I.completeToStep('/tenancy-start', {
    'living-status': 'yes'});
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I see an error if I enter an invalid date', (
  I,
  tenancyStartPage
) => {
  I.completeToStep('/tenancy-start', {
    'living-status': 'yes'});
  tenancyStartPage.enterDate('invalid');
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I see an error if I enter a future date', (
  I,
  tenancyStartPage
) => {
  I.completeToStep('/tenancy-start', {
    'living-status': 'yes'});
  tenancyStartPage.enterDate('future');
  I.submitForm();
  I.seeErrors(tenancyStartPage.fields.date);
});

Scenario('I see an error when I enter a date before the 1 Dec 2014', (
  I
) => {
  I.completeToStep('/tenancy-start', {
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2013');
  I.submitForm();
  I.seeErrors('#tenancy-start-group');
});

Scenario('I see an error when I enter a date between 1 Dec 2014 & 31st Jan 2016 & the postcode is not in the West Midlands', (
  I
) => {
  I.completeToStep('/tenancy-start', {
    'property-address-postcode': 'SW1P 4DF',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeErrors('#tenancy-start-group');
});

Scenario('I can go to the next step when I enter a date between 1 Dec 2014 & 31st Jan 2016 & the postcode is in the West Midlands', (
Scenario('When I submit a valid date Then I am taken to the check confirmed page', (
  I,
  tenantDetailsPage,
  tenancyStartPage,
  checkConfirmedPage
) => {
  I.completeToStep('/tenancy-start', {
    'property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2015');
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I can go to the next step when I enter a date after 31st Jan 2016, that is not in the future & the postcode IS NOT in the the West Midlands', (
  I,
  tenantDetailsPage
) => {
  I.completeToStep('/tenancy-start', {
    'property-address-postcode': 'SW1P 4DF',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I can go to the next step when I enter a date after 31st Jan 2016, that is not in the future & the postcode IS IN the West Midlands', (
  I,
  tenantDetailsPage
) => {
  I.completeToStep('/tenancy-start', {
    'property-address-postcode': 'B1 2EA',
    'living-status': 'yes'});
  I.fillField('#tenancy-start-day', '1');
  I.fillField('#tenancy-start-month', '1');
  I.fillField('#tenancy-start-year', '2017');
  I.submitForm();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
