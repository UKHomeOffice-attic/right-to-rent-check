'use strict';
const westMidPostcodes = require('../../../west-midlands-postcodes.js');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    return locals;
  }

  // there is an existing validator {type: 'after', arguments: '2014-11-30'}
  // this is to cover the other scenario
  validate(req, res, next) {
    const tenancyStart = req.form.values['tenancy-start'];
    const currentPostcode = req.sessionModel.get('property-address-postcode');

    if (tenancyStart >= '2014-12-01' && tenancyStart <= '2016-01-31') {
      const isWestMidPostcode = this.checkPostcode(currentPostcode);
      if (!isWestMidPostcode) {
        next({
          'tenancy-start': new this.ValidationError('tenancy-start', { type: 'incorrect'})
        });
      } else {
        super.validate(req, res, next);
      }
    } else {
        super.validate(req, res, next);
    }
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
};
