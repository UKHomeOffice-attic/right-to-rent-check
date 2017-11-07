'use strict';

const moment = require('moment');
const _ = require('lodash');

const AddressLookup = require('hof-behaviour-address-lookup');

const checkPilotPostcodeAndDate = require('./behaviours/tenancy-start-postcode-check');
const ageRestriction = require('./behaviours/age-restriction');
const getLivingStatus = require('./behaviours/get-living-status');
const tenants = require('./behaviours/tenants')([
  'tenant-name',
  'tenant-dob',
  'tenant-country',
  'tenant-reference-number',
  'tenant-passport-number',
  'tenant-brp-number',
  'tenant-recorded-delivery-number'
]);
const confirmTenants = require('./behaviours/confirm-tenants.js');
const getDeclarer = require('./behaviours/get-declarer');
const rentalQuestions = require('./behaviours/rental-questions');
const filterSections = require('./behaviours/confirm-filter-sections');
const dynamicTitle = require('./behaviours/dynamic-title');
const pdfUploader = require('./behaviours/pdf-uploader');
const config = require('../../config');
const customerEmailer = require('./behaviours/customer-email')(config.email);
const caseworkerEmailer = require('./behaviours/caseworker-email')(config.email);
const summarySections = require('./behaviours/summary-sections');

const SummaryConfig = {
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

module.exports = {
  name: 'right-to-rent-check',
  params: '/:action?/:id?',
  behaviours: [require('./behaviours/filter-fields')],
  steps: {
    '/eligibility-check': {
      next: '/documents-check'
    },
    '/documents-check': {
      fields: ['documents-check'],
      next: '/rental-property-location',
      forks: [{
        target: '/documents-check-yourself',
        condition: {
          field: 'documents-check',
          value: 'yes'
        }
      }],
    },
    '/documents-check-yourself': {},
    '/rental-property-location': {
      next: '/check-not-needed-location',
      fields: ['rental-property-location'],
      forks: [{
        target: '/rental-property-address',
        condition: {
          field: 'rental-property-location',
          value: 'england'
        }
      }]
    },
    '/check-not-needed-location': {},
    '/rental-property-address': {
      behaviours: AddressLookup({
        required: true,
        addressKey: 'rental-property-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/person-in-property'
    },
    '/person-in-property': {
      fields: ['living-status'],
      next: '/tenancy-start-date',
      forks: [{
        target: '/tenant-in-uk',
        condition: {
          field: 'living-status',
          value: 'no'
        }
      }],
    },
    '/tenant-in-uk': {
      fields: ['tenant-in-uk'],
      next: '/tenant-current-address',
      forks: [{
        target: '/check-not-needed-uk',
        condition: {
          field: 'tenant-in-uk',
          value: 'no'
        }
      }],
    },
    '/check-not-needed-uk': {},
    '/tenancy-start-date': {
      behaviours: [checkPilotPostcodeAndDate],
      fields: ['tenancy-start'],
      next: '/check-confirmed'
    },
    '/check-confirmed': {
      next: '/start',
      behaviours: [rentalQuestions]
    },
    '/start': {
      next: '/tenant-details'
    },
    '/tenant-current-address': {
      behaviours: AddressLookup({
        addressKey: 'tenant-current-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/check-confirmed'
    },
    '/tenant-details': {
      behaviours: [ageRestriction],
      fields: [
        'tenant-name',
        'tenant-dob',
        'tenant-country'
      ],
      next: '/tenant-additional-details',
      forks: [{
        target: '/request-another-tenant',
        condition: (req) => {
          return _.find(req.sessionModel.get('tenants'), {
            edit: true
          });
        }
      }]
    },
    '/tenant-additional-details': {
      fields: [
        'tenant-additional-details',
        'tenant-reference-number',
        'tenant-passport-number',
        'tenant-brp-number',
        'tenant-recorded-delivery-number'
      ],
      next: '/request-another-tenant'
    },
    '/request-another-tenant': {
      behaviours: [tenants, getLivingStatus],
      fields: [
        'tenant-add-another',
      ],
      next: '/landlord-or-agent',
      forks: [{
        target: '/tenant-details',
        condition: {
          field: 'tenant-add-another',
          value: 'yes'
        }
      }]
    },
    '/landlord-or-agent': {
      fields: [
        'representative'
      ],
      next: '/landlord-details',
      forks: [{
        target: '/agent-details',
        condition: {
          field: 'representative',
          value: 'agent'
        }
      }]
    },
    '/landlord-details': {
      fields: [
        'landlord-name',
        'landlord-company',
        'landlord-email-address',
        'landlord-phone-number'
      ],
      next: '/landlord-address'
    },
    '/agent-details': {
      fields: [
        'agent-company',
        'agent-name',
        'agent-email-address',
        'agent-phone-number'
      ],
      next: '/agent-address'
    },
    '/agent-address': {
      behaviours: AddressLookup({
        required: true,
        addressKey: 'agent-address',
        apiSettings: {
          hostname: config.postcode.hostname
        }
      }),
      next: '/landlord-name'
    },
    '/landlord-name': {
      fields: [
        'landlord-name'
      ],
      next: '/landlord-address'
    },
    '/landlord-address': {
      behaviours: [
        dynamicTitle('representative'),
        AddressLookup({
          required: true,
          addressKey: 'landlord-address',
          apiSettings: {
            hostname: config.postcode.hostname
          }
        })
      ],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: [filterSections, summarySections, confirmTenants],
      nullValue: 'pages.confirm.undefined',
      sections: SummaryConfig,
      next: '/declaration'
    },
    '/declaration': {
      behaviours: [caseworkerEmailer, customerEmailer, getDeclarer, summarySections, pdfUploader],
      nullValue: 'pages.confirm.undefined',
      sections: SummaryConfig,
      next: '/confirmation'
    },
    '/confirmation': {},
    '/check-not-needed-date': {
      next: '/start'
    },
    '/privacy-policy': {
    },
  }
};
