'use strict';

const path = require('path');

const pagesPath = page => path.resolve(__dirname,
  `./apps/right-to-rent-check/acceptance/pages/${page}`);

module.exports = {
  name: 'right-to-rent-check',
  tests: './apps/**/acceptance/features/*.js',
  include: {
    propertyPage: pagesPath('property.js'),
    tenancyStartPage: pagesPath('tenancy-start.js'),
    agentDetailsPage: pagesPath('agent-details.js'),
    landlordNamePage: pagesPath('landlord-name.js'),
    currentPropertyAddressPage: pagesPath('current-property-address.js')
  }
};
