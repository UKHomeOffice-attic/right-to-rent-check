/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'rental-property-address',
  backlink: '#step a',

  id: {
    postcode: '#property-address-postcode',
    select: '#property-address-select',
    address: '#property-address',
    manualLink: '[href="?step=manual"]',
    cantFind: '.cant-find',
    change: '.change-postcode'
  },

  steps: {
    postcode: 'step=postcode',
    lookup: 'step=lookup',
    manual: 'step=manual'
  },

  content: {
    invalidPostcode: 'XXXXXX',
    postcode: 'CR0 2EU',
    select: '49 Sydenham Road, Croydon, CR0 2EU',
    address: '49 Sydenham Road\nCroydon\nCR0 2EU'
  },

  enterValidPostcode() {
    I.fillField(this.id.postcode, this.content.postcode);
    I.submitForm();
  }
};
