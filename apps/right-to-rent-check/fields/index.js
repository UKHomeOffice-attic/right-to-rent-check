'use strict';
const dateComponent = require('hof-component-date');

module.exports = {
  'living-status': {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      'yes',
      'no'
    ]
  },
  'tenant-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'tenant-country': {
    mixin: 'select',
    validate: 'required',
    className: ['typeahead', 'js-hidden'],
    options: [''].concat(require('homeoffice-countries').allCountries)
  },
  'tenant-dob': dateComponent('tenant-dob', {
    validate: ['required', 'date', 'before']
  }),
};
