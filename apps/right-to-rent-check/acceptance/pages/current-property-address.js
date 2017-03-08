'use strict';

let I;

module.exports = {
  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'current-property-address',

  elements: {
    manualEntry: 'a[href="?step=manual"]',
    address: '#current-address'
  },

  content: {
    address: 'An address'
  },

  completeAddress() {
    I.click(this.elements.manualEntry);
    I.fillField(this.elements.address, this.content.address);
    I.submitForm();
  }
}