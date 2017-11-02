'use strict';

const Emailer = require('hof-behaviour-emailer');
const path = require('path');

module.exports = config => {
  if (config.transport !== 'stub' && !config.from && !config.replyTo) {
    // eslint-disable-next-line no-console
    console.warn('WARNING: Email `from` address must be provided. Falling back to stub email transport.');
  }
  return Emailer(Object.assign({}, config, {
    transport: config.from ? config.transport : 'stub',
    recipient: config.caseworker,
    subject: (model, translate) => translate('email.caseworker.subject'),
    template: path.resolve(__dirname, '../emails/caseworker.html')
  }));
};
