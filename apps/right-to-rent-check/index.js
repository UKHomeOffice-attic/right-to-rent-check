'use strict';

const dateComponent = require('hof-component-date');

module.exports = {
  name: 'right-to-rent-check',
  baseUrl: '/right-to-rent-check',
  params: '/:action?/:id?',
  steps: {
    '/request-property': {
      fields: ['living-status'],
      next: '/request-tenancy-start',
      forks: [{
        target: '/request-current-property-address',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }]
    },
    '/request-tenancy-start': {
      next: '/tenant-details'
    },
    '/request-current-property-address': {
      next: '/request-current-property-address-select'
    },
    '/request-current-property-address-select': {
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
      next: '/confirm'
    },
    '/confirm': {
      next: '/complete'
    },
    '/complete': {}
  }
};
