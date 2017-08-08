/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';

let I;

module.exports = {

  _init() {
    I = require('so-acceptance/steps')();
  },

  url: 'tenant-another',

  fields: {
    group: '#tenant-add-another-group',
    yes: '#tenant-add-another-yes',
    no: '#tenant-add-another-no'
  },

  content: {
    'details-table': '.tenant-details'
  },

  selectors: {
    backLink: '#step a',
    change: {
      name: '#content > div > form > table > tbody > tr:nth-child(1) > td:nth-child(3) > a',
      dob: '#content > div > form > table > tbody > tr:nth-child(2) > td:nth-child(3) > a',
      country: '#content > div > form > table > tbody > tr:nth-child(3) > td:nth-child(3) > a',
      reference: '#content > div > form > table > tbody > tr:nth-child(4) > td:nth-child(3) > a',
      passport: '#content > div > form > table > tbody > tr:nth-child(5) > td:nth-child(3) > a',
      brp: '#content > div > form > table > tbody > tr:nth-child(6) > td:nth-child(3) > a',
      delivery: '#content > div > form > table > tbody > tr:nth-child(7) > td:nth-child(3) > a',
    }

  },

  seeOneElement(id) {
    return this.content[id].length === 1;
  }

};
