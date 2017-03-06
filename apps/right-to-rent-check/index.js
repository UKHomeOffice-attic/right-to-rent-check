'use strict';

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  steps: {
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
      next: '/tenant-details'
    },
    '/current-property-address': {
      next: '/current-property-address-select'
    },
    '/current-property-address-select': {
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
      next: '/confirm'
    },
    '/confirm': {
      next: '/complete'
    },
    '/complete': {}
  }
};
