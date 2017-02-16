'use strict';

const controllers = require('hof-controllers');
const dateComponent = require('hof-component-date');

module.exports = {
  name: 'right-to-rent-check',
  baseUrl: '/right-to-rent-check',
  params: '/:action?/:id?',
  steps: {
    '/': {
      controller: controllers.start,
      next: '/request-property'
    },
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
      next: '/request-n-tenant-name'
    },
    '/request-current-property-address': {
      next: '/request-current-property-address-select'
    },
    '/request-current-property-address-select': {
      next: '/request-n-tenant-name'
    },
    '/request-n-tenant-name': {
      fields: [
        'tenant-name',
        'tenant-country',
        'date-field'
      ],
      next: '/confirm'
    },
    '/confirm': {
      controller: require('hof-confirm-controller'),
      next: '/complete'
    },
    '/complete': {}
  }
};
