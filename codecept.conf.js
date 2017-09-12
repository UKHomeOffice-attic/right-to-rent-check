'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/right-to-rent-check/acceptance/pages/${page}`);

module.exports = {
  name: 'right-to-rent-check',
  tests: './apps/**/acceptance/features/*.js',
  include: {
    eligibilityCheckPage: pagesPath('eligibility-check.js'),
    documentCheckPage: pagesPath('documents-check.js'),
    documentCheckYourselfPage: pagesPath('documents-check-yourself.js'),
    rentalPropertyLocationPage: pagesPath('rental-property-location.js'),
    checkNotNeededLocationPage: pagesPath('check-not-needed-location.js'),
    tenantInUkPage: pagesPath('tenant-in-uk.js'),
    checkConfirmedPage: pagesPath('check-confirmed.js'),
    ukCheckYourselfPage: pagesPath('uk-check-yourself.js'),
    startPage: pagesPath('start.js'),
    checkNotNeededDatePage: pagesPath('check-not-needed-date.js'),
    personInPropertyPage: pagesPath('person-in-property.js'),
    personLocationPage: pagesPath('person-location.js'),
    tenancyStartPage: pagesPath('tenancy-start-date.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    currentPropertyAddressPage: pagesPath('current-property-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    tenantAdditionalDetailsPage: pagesPath('tenant-additional-details.js'),
    tenantAddAnotherPage: pagesPath('tenant-another.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    landlordAgentPage: pagesPath('landlord-agent.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    landlordDetailsPage: pagesPath('landlord-details.js'),
    confirmPage: pagesPath('confirm.js'),
    declarationPage: pagesPath('declaration.js')
  }
};
