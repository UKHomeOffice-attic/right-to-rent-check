'use strict';

const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'agent-details': [
    'agent-company',
    'agent-name',
    'agent-email-address',
    'rental-property-address'
  ],
  'landlord-details': [
    'landlord-company',
    'landlord-name',
    'landlord-email-address',
    'rental-property-address'
  ],
  'tenant-details': [
    'tenant-current-address',
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
      ]
    }
  ],
  'agent-contact': [
    'agent-phone-number',
    'agent-address',
    'landlord-name',
    'landlord-address'
  ],
  'landlord-contact': [
    'landlord-phone-number',
    'landlord-address'
  ]
};
