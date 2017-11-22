'use strict';

const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'key-details': [{
      field: 'documents-check',
      edit: false
    }, {
      field: 'rental-property-location',
      edit: false
    }, {
      field: 'rental-property-address',
      edit: false
    }, {
      field: 'living-status',
      edit: false
    }, {
      field: 'tenant-in-uk',
      edit: false
    }, {
      field: 'tenant-current-address',
      edit: false
    }, {
      field: 'tenancy-start',
      parse: d => moment(d).format(config.dateFormat),
      edit: false
    }
  ],
  'tenant-details': [
    {
      field: 'tenants',
      children: [
        'tenant-name',
        {
          field: 'tenant-dob',
          parse: d => moment(d).format(config.dateFormat)
        },
        'tenant-country',
        'tenant-reference-number',
        'tenant-passport-number',
        'tenant-brp-number',
        'tenant-recorded-delivery-number'
      ],
      uuid: 'tenant-uuid',
      lists: [{
        id: 'tenant-additional-details',
        fields: [{
          name: 'tenant-reference-number',
          id: 'reference-number'
        }, {
          name: 'tenant-passport-number',
          id: 'passport-number'
        }, {
          name: 'tenant-brp-number',
          id: 'brp-number'
        }, {
          name: 'tenant-recorded-delivery-number',
          id: 'recorded-delivery-number'
        }]
      }]
    }
  ],
  'agent-details': [
    'agent-company',
    'agent-name',
    'agent-email-address',
    'agent-phone-number',
    {
      field: 'agent-address',
      step: '/agent-address'
    }
  ],
  'landlord-details': [
    'landlord-name',
    'landlord-company',
    'landlord-email-address',
    'landlord-phone-number',
    {
      field: 'landlord-address',
      step: '/landlord-address'
    }
  ]
};
