'use strict';

const _ = require('lodash');
const AddressLookup = require('hof-behaviour-address-lookup');
const checkPilotPostcodeAndDate = require('./behaviours/tenancy-start-postcode-check');
const tenants = require('./behaviours/tenants')([
  'tenant-name',
  'tenant-dob',
  'tenant-country',
  'tenant-reference-number',
  'tenant-passport-number',
  'tenant-brp-number',
  'tenant-recorded-delivery-number'
]);
const config = require('../../config');

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  behaviours: [require('./behaviours/filter-fields')],
  steps: {
    '/eligibility-check': {
      next: '/documents-check'
    },
    '/documents-check': {
      fields: ['documents-check'],
      next: '/rental-property-location',
      forks: [{
        target: '/documents-check-yourself',
        condition: {
          field: 'documents-check',
          value: 'yes'
        }
      }],
    },
    '/documents-check-yourself': {},
    '/rental-property-location': {
      next: '/check-not-needed-location',
      fields: ['rental-property-location'],
      forks: [{
        target: '/rental-property-address',
        condition: {
          field: 'rental-property-location',
          value: 'england'
        }
      }]
    },
    '/check-not-needed-location': {},
    '/rental-property-address': {
      behaviours: AddressLookup({
        addressKey: 'property-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/person-in-property'
    },
    '/person-in-property': {
      fields: ['living-status'],
      next: '/tenancy-start',
      forks: [{
        target: '/tenant-in-uk',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }],
    },
    '/tenant-in-uk': {
      fields: ['tenant-in-uk'],
      next: '/current-property-address',
      forks: [{
        target: '/uk-check-yourself',
        condition: {
          field: 'tenant-in-uk',
          value: 'no'
        }
      }],
    },
    '/uk-check-yourself': {
    },
    '/tenancy-start': {
      behaviours: [checkPilotPostcodeAndDate],
      fields: ['tenancy-start'],
      next: '/check-confirmed'
    },
    '/check-confirmed': {
      next: '/start'
    },
    '/start': {
      next: '/tenant-details'
    },
    '/current-property-address': {
      behaviours: AddressLookup({
        addressKey: 'current-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/check-confirmed'
    },
    '/tenant-details': {
      fields: [
        'tenant-name',
        'tenant-dob',
        'tenant-country'
      ],
      next: '/tenant-additional-details',
      forks: [{
        target: '/tenant-another',
        condition: (req) => {
          return _.find(req.sessionModel.get('tenants'), {
            edit: true
          });
        }
      }]
    },
    '/tenant-additional-details': {
      fields: [
        'tenant-additional-details',
        'tenant-reference-number',
        'tenant-passport-number',
        'tenant-brp-number',
        'tenant-recorded-delivery-number'
      ],
      next: '/tenant-another'
    },
    '/tenant-another': {
      behaviours: [tenants],
      fields: [
        'tenant-add-another',
      ],
      next: '/landlord-agent',
      forks: [{
        target: '/tenant-details',
        condition: {
          field: 'tenant-add-another',
          value: 'yes'
        }
      }]
    },
    '/landlord-agent': {
      fields: [
        'representative'
      ],
      next: '/landlord-details',
      forks: [{
        target: '/agent-details',
        condition: {
          field: 'representative',
          value: 'agent'
        }
      }]
    },
    '/landlord-details': {
      fields: [
        'landlord-name',
        'landlord-company',
        'landlord-email-address',
        'landlord-phone-number'
      ],
      next: '/confirm'
    },
    '/agent-details': {
      fields: [
        'agent-company',
        'agent-name',
        'agent-email-address',
        'agent-phone-number'
      ],
      next: '/landlord-name'
    },
    '/landlord-name': {
      fields: [
        'landlord-name-agent'
      ],
      next: '/landlord-address'
    },
    '/landlord-address': {
      next: '/confirm'
    },
    '/confirm': {
      next: '/complete'
    },
    '/check-not-needed': {
      next: '/start'
    },
    '/complete': {}
  }
};
