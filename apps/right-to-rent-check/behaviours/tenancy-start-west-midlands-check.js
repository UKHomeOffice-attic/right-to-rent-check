'use strict';
const westMidPostcodes = require('../../../west-midland-postcodes.js');
const pilotStartDate = new Date('2014/12/01').getTime();
const pilotEndDate = new Date('2016/01/31').getTime();

module.exports = superclass => class extends superclass {
  saveValues(req, res, callback) {
    let tenancyStart = req.form.values['tenancy-start'];
    tenancyStart = new Date(tenancyStart).getTime();
    const currentPostcode = req.sessionModel.get('property-address-postcode');
    req.sessionModel.set('valid-tenancy', true);

    if (tenancyStart < pilotStartDate) {
      req.sessionModel.unset('valid-tenancy');
    } else if (tenancyStart >= pilotStartDate && tenancyStart <= pilotEndDate) {
      if (!this.checkPostcode(currentPostcode)) {
        req.sessionModel.unset('valid-tenancy');
      }
    }

    callback();
    }

  checkPostcode(currentPostcode) {
    let flag = false;

    westMidPostcodes.forEach((postcode) => {
      if (currentPostcode.startsWith(postcode)) {
        flag = true;
      }
    });
    return flag;
  }

  getNextStep(req, res) {
    if (req.sessionModel.get('valid-tenancy') !== true) {
      return '/check-not-needed';
    }
    return super.getNextStep(req, res);
  }
};
