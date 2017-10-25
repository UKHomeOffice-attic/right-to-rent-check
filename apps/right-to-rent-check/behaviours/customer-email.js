'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');
const moment = require('moment');

const obfuscate = str => str.replace(/./g, '*');

const getDataRows = model => {
  const isAgent = model.representative === 'agent';
  return [
    {
      table: [
        { label: 'Date and time of submission', value: moment().format('DD-MM-YYYY, hh:mma') },
        { label: 'Rental property address', value: model['rental-property-address'] },
        { label: 'Current property address', value: model['current-property-address'] }
      ]
    },
    {
      title: 'Tenant details',
      table: model.tenants.reduce((fields, tenant, i) => fields.concat([
        { linebreak: i > 0 },
        { label: 'Tenant\'s name', value: tenant['tenant-name'] },
        { label: 'Date of birth', value: moment(tenant['tenant-dob']).format('DD-MM-YYYY') },
        { label: 'Country of nationality', value: tenant['tenant-country'] },
        { label: 'Home Office reference number', value: obfuscate(tenant['tenant-reference-number']) },
        { label: 'Passport number', value: obfuscate(tenant['tenant-passport-number']) },
        { label: 'Biometric residence permit number', value: obfuscate(tenant['tenant-brp-number']) },
        { label: 'Recorded delivery number', value: obfuscate(tenant['tenant-recorded-delivery-number']) }
      ]), [])
    },
    isAgent && {
      title: 'Agent details',
      table: [
        { label: 'Company name', value: model['agent-company'] },
        { label: 'Name', value: model['agent-name'] },
        { label: 'Email', value: model['agent-email-address'] },
        { label: 'Phone number', value: model['agent-phone-number'] },
        { label: 'Address', value: model['agent-address'] }
      ]
    },
    {
      title: 'Landlord details',
      table: [
        { label: 'Name', value: model['landlord-name'] },
        !isAgent && { label: 'Email', value: model['landlord-email-address'] },
        !isAgent && { label: 'Phone number', value: model['landlord-phone-number'] },
        { label: 'Address', value: model['landlord-address'] }
      ].filter(Boolean)
    },

  ].filter(Boolean);
};

module.exports = config => Emailer(Object.assign({}, config.email, {
  recipient: model => {
    return model.representative === 'agent' ? model['agent-email-address'] : model['landlord-email-address'];
  },
  subject: 'Right to rent check',
  template: path.resolve(__dirname, '../emails/customer.html'),
  parse: model => Object.assign(model, { data: getDataRows(model) })
}));
