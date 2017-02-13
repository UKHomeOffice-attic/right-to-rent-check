'use strict';

const controllers = require('hof-controllers');

module.exports = {
  name: 'right-to-rent-check',
  baseUrl: '/right-to-rent-check',
  steps: {
    '/': {
      controller: controllers.start,
      next: '/name'
    },
    '/name': {
      fields: ['name'],
      next: '/confirm'
    },
    '/confirm': {
      controller: require('hof-confirm-controller'),
      next: '/complete'
    },
    '/complete': {}
  }
};
