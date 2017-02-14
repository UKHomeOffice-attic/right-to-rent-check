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
      next: '/confirm'
    },
    '/confirm': {
      controller: require('hof-confirm-controller'),
      next: '/complete'
    },
    '/complete': {}
  }
};
