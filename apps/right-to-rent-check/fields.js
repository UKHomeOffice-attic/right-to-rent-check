'use strict';
const dateComponent = require('hof-component-date');

module.exports = {
  'documents-check': {
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
  'tenant-in-uk': {
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
  'tenancy-start': dateComponent('tenancy-start', {
    validate: ['required', 'before'],
    legend: {
      className: 'visuallyhidden'
    }
  }),
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
  'tenant-additional-details': {
    mixin: 'checkbox-group',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      {
        value: 'reference-number',
        toggle: 'tenant-reference-number',
        child: 'input-text'
      },
      {
        value: 'passport-number',
        toggle: 'tenant-passport-number',
        child: 'input-text'
      },
      {
        value: 'brp-number',
        toggle: 'tenant-brp-number',
        child: 'input-text'
      },
      {
        value: 'recorded-delivery-number',
        toggle: 'tenant-recorded-delivery-number',
        child: 'input-text'
      }
    ]
  },
  'tenant-reference-number': {
    validate: 'required',
    dependent: {
      field: 'tenant-additional-details',
      value: 'reference-number'
    }
  },
  'tenant-passport-number': {
    validate: 'required',
    dependent: {
      field: 'tenant-additional-details',
      value: 'passport-number'
    }
  },
  'tenant-brp-number': {
    validate: 'required',
    dependent: {
      field: 'tenant-additional-details',
      value: 'brp-number'
    }
  },
  'tenant-recorded-delivery-number': {
    validate: 'required',
    dependent: {
      field: 'tenant-additional-details',
      value: 'recorded-delivery-number'
    }
  },
  'tenant-add-another': {
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
  'agent-company': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'agent-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'agent-phone-number': {
    mixin: 'input-text',
    validate: 'required'
  },
  'landlord-name-agent': {
    mixin: 'input-text',
    validate: 'required',
    labelClassName: 'visuallyhidden'
  },
  'representative': {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      'landlord',
      'agent'
    ]
  },
  'landlord-name': {
    mixin: 'input-text',
    validate: 'required'
  },
  'landlord-company': {
    mixin: 'input-text'
  },
  'landlord-email-address': {
    mixin: 'input-text',
    validate: ['required', 'email']
  },
  'landlord-phone-number': {
    mixin: 'input-phone',
    validate: ['required']
  }
};
