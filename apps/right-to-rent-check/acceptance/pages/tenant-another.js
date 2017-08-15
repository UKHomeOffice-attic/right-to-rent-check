'use strict';

module.exports = {

  _init() {},

  url: 'tenant-another',

  fields: {
    group: '#tenant-add-another-group',
    yes: '#tenant-add-another-yes',
    no: '#tenant-add-another-no'
  },

  selectors: {
    backLink: '#step a',
    change: {
      name: '.tenant-details tr:nth-child(1) > td:nth-child(3) > a',
      dob: '.tenant-details tr:nth-child(2) > td:nth-child(3) > a',
      country: '.tenant-details tr:nth-child(3) > td:nth-child(3) > a',
      reference: '.tenant-details tr:nth-child(4) > td:nth-child(3) > a',
      passport: '.tenant-details tr:nth-child(5) > td:nth-child(3) > a',
      brp: '.tenant-details tr:nth-child(6) > td:nth-child(3) > a',
      delivery: '.tenant-details tr:nth-child(7) > td:nth-child(3) > a',
    }

  }

};
