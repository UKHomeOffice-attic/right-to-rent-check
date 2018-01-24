'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');

const getSubjectWithTotalTenants = (model, translate) => {
  const totalTenants = model.tenants.length;
  let subject = translate('email.caseworker.subject.prefix') + totalTenants;
  if (totalTenants === 1) {
    return subject + translate('email.caseworker.subject.singular-suffix');
  }
  return subject + translate('email.caseworker.subject.suffix');
};

module.exports = config => {
  if (config.transport !== 'stub' && !config.from && !config.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, config, {
    transport: config.from ? config.transport : 'stub',
    recipient: config.caseworker,
    subject: (model, translate) => getSubjectWithTotalTenants(model, translate),
    template: path.resolve(__dirname, '../emails/caseworker.html')
  }));
};
