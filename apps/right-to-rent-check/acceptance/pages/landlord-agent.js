'use strict';

let I;

module.exports = {
  _init() {
    I = require('so-acceptance/steps.js')();
  },

  url: 'landlord-agent',
  fields: {
    landlord: '#representative-landlord',
    agent: '#representative-agent'
  }
};
