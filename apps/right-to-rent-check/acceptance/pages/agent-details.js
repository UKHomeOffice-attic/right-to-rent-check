'use strict';

module.exports = {
  url: 'agent-details',
  fields: {
    company: '#agent-company',
    name: '#agent-name',
    email: '#agent-email-address',
    phone: '#agent-phone-number'
  },
  content: {
    company: 'UK Home Office',
    name: 'Sterling Archer',
    email: 'sterling@archer.com',
    phone: '01234567890',
    invalidEmail: 'invalid',
    invalidPhone: 'invalid'
  }
};
