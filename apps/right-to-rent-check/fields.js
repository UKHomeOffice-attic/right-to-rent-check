'use strict';
const _ = require('lodash');
const dateComponent = require('hof-component-date');
const countries = require('hof-util-countries')();
countries.push({value: 'Stateless', label: 'Stateless'});
const amendedCountries = _.filter(countries, country =>
  country.value !== 'Stateless, under the 1954 Convention');

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
  'rental-property-location': {
    mixin: 'radio-group',
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    },
    options: [
      'england',
      'scotland',
      'wales',
      'ireland'
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
    options: [{
      value: '',
      label: 'fields.tenant-country.options.null'
    }].concat(amendedCountries)
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
    mixin: 'input-text'
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
