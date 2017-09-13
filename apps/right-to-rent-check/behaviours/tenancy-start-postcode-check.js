'use strict';
const pilotPostcodes = require('../../../pilot-postcodes.js');
const pilotStartDate = new Date('2014/12/01').getTime();
const pilotEndDate = new Date('2016/01/31').getTime();
const _ = require('lodash');

module.exports = superclass => class extends superclass {
  saveValues(req, res, callback) {
    let tenancyStart = req.form.values['tenancy-start'];
    tenancyStart = new Date(tenancyStart).getTime();
    const currentPostcode = req.sessionModel.get('property-address-postcode');

    if (tenancyStart >= pilotStartDate && tenancyStart <= pilotEndDate) {
      if (this.checkPostcode(currentPostcode) === true) {
        req.sessionModel.set('valid-tenancy', true);
      }
    } else if (tenancyStart > pilotEndDate) {
      req.sessionModel.set('valid-tenancy', true);
    }
    callback();
    }

  checkPostcode(currentPostcode) {
    return _.some(pilotPostcodes, postcode => currentPostcode.startsWith(postcode));
  }

  getNextStep(req, res) {
    if (req.sessionModel.get('valid-tenancy') !== true) {
      return '/check-not-needed-date';
    }
    req.sessionModel.unset('valid-tenancy');
    return super.getNextStep(req, res);
  }
};
