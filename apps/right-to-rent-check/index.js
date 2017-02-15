'use strict';

const controllers = require('hof-controllers');

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
      next: '/confirm'
    },
    '/request-current-property-address': {
      next: '/confirm'
    },
    '/confirm': {
      controller: require('hof-confirm-controller'),
      next: '/complete'
    },
    '/complete': {}
  }
};
