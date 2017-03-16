'use strict';

const AddressLookup = require('hof-behaviour-address-lookup');

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  steps: {
    '/start': {
      next: '/check-you-can-use'
    },
    '/check-you-can-use': {
      next: 'property'
    },
    '/property': {
      fields: ['living-status'],
      next: '/tenancy-start',
      forks: [{
        target: '/current-property-address',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }]
    },
    '/tenancy-start': {
      fields: ['tenancy-start'],
      next: '/current-property-address'
    },
    '/current-property-address': {
      behaviours: AddressLookup({
        addressKey: 'current-address'
      }),
      next: '/tenant-details'
    },
    '/tenant-details': {
      fields: [
        'tenant-name',
        'tenant-dob',
        'tenant-country'
      ],
      next: '/tenant-additional-details'
    },
    '/tenant-additional-details': {
      next: '/tenant-another'
    },
    '/tenant-another': {
      next: '/landlord-agent'
    },
    '/landlord-agent': {
      next: '/agent-details'
    },
    '/landlord-details': {
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
    '/complete': {}
  }
};
