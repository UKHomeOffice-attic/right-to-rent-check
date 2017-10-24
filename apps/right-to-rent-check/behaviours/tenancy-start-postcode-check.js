'use strict';

const pilotPostcodes = require('../../../config.js').postcode.pilot;
const pilotStartDate = new Date('2014/12/01').getTime();
const pilotEndDate = new Date('2016/01/31').getTime();
const _ = require('lodash');
const inRange = date => date >= pilotStartDate && date <= pilotEndDate;
const isPilotOrUndefined = postcode => {
  if (postcode === undefined) {
    return true;
  }
  return _.some(pilotPostcodes, pilot => postcode.startsWith(pilot));
};

module.exports = superclass => class extends superclass {

  saveValues(req, res, next) {
    super.saveValues(req, res, err => {
      const tenancyStart = new Date(req.form.values['tenancy-start']).getTime();
      const postcode = req.sessionModel.get('rental-property-address-postcode');

      if (inRange(tenancyStart)) {
        req.sessionModel.set('valid-tenancy', isPilotOrUndefined(postcode));
      } else if (tenancyStart > pilotEndDate) {
        req.sessionModel.set('valid-tenancy', true);
      }
      next(err);
    });
  }

  getNextStep(req, res) {
    if (req.sessionModel.get('valid-tenancy') !== true) {
      return '/check-not-needed-date';
    }
    req.sessionModel.unset('valid-tenancy');
    return super.getNextStep(req, res);
  }
};
