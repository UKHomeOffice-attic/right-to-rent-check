'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/right-to-rent-check/acceptance/pages/${page}`);

module.exports = {
  name: 'right-to-rent-check',
  tests: './apps/**/acceptance/features/*.js',
  include: {
    startPage: pagesPath('start.js'),
    checkYouCanUsePage: pagesPath('check-you-can-use.js'),
    propertyPage: pagesPath('property.js'),
    tenancyStartPage: pagesPath('tenancy-start.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    currentPropertyAddressPage: pagesPath('current-property-address.js'),
    tenantDetailsPage: pagesPath('tenant-details.js'),
    propertyAddressPage: pagesPath('property-address.js'),
    landlordAddressPage: pagesPath('landlord-address.js'),
    landlordDetailsPage: pagesPath('landlord-details.js'),
    confirmPage: pagesPath('confirm.js')
    landlordAgentPage: pagesPath('landlord-agent.js'),
    landlordAddressPage: pagesPath('landlord-address.js')
  }
};
