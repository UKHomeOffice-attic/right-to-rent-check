/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

const _ = require('lodash');

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: '/tenant-additional-details',

  fields: {
    'reference-number': '#tenant-additional-details-reference-number',
    'passport-number': '#tenant-additional-details-passport-number',
    'brp-number': '#tenant-additional-details-brp-number',
    'recorded-delivery-number': '#tenant-additional-details-recorded-delivery-number'
  },

  hidden: {
    'reference-number': '#tenant-reference-number',
    'passport-number': '#tenant-passport-number',
    'brp-number': '#tenant-brp-number',
    'recorded-delivery-number': '#tenant-recorded-delivery-number'
  },

  checkFields() {
    _.values(this.fields).forEach(id => {
      I.click(id);
    });
  },

  completeAllFields() {
    _.values(this.fields).forEach(id => I.click(id));
    _.values(this.hidden).forEach(id => I.fillField(id, '12345'));
  }

};
