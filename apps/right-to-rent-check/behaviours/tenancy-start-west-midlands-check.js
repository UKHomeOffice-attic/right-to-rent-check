'use strict';
const westMidPostcodes = require('../../../west-midland-postcodes.js');

module.exports = superclass => class extends superclass {
  saveValues(req, res, callback) {
    const tenancyStart = req.form.values['tenancy-start'];
    const currentPostcode = req.sessionModel.get('property-address-postcode');
    req.sessionModel.set('valid-tenancy', true);

    if (tenancyStart < '2014-12-01') {
      req.sessionModel.set('valid-tenancy', false);
    } else if (tenancyStart >= '2014-12-01' && tenancyStart <= '2016-01-31') {
      const isWestMidPostcode = this.checkPostcode(currentPostcode);
      if (!isWestMidPostcode) {
        req.sessionModel.set('valid-tenancy', false);
      }
    }
    super.saveValues(req, res, callback);
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

  getNextStep(req, res, callback) {
    if (req.sessionModel.get('valid-tenancy') === false) {
      req.form.options.next = '/exit';
    }
    return super.getNextStep(req, res, callback);
  }
};
