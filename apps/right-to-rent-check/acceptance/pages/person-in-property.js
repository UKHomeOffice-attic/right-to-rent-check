'use strict';

let I;

module.exports = {
  _init() {
    I = require('so-acceptance/steps.js')();
  },

  url: 'person-in-property',
  fields: {
    yes: '#living-status-yes',
    no: '#living-status-no'
  },
  livingStatusGroup: '#living-status-group',

  selectYesAndSubmit() {
    I.click(this.fields.yes);
    I.submitForm();
  },

  selectNoAndSubmit() {
    I.click(this.fields.no);
    I.submitForm();
  }
};
