'use strict';

const moment = require('moment');

module.exports = superclass => class extends superclass {
  validate(req, res, next) {
    const ageRestriction = moment().subtract(17, 'years').subtract(11, 'months');
    const tenantDob = moment(req.form.values['tenant-dob']);
    if (tenantDob > ageRestriction) {
      next({
        'tenant-dob': new this.ValidationError('tenant-dob', { type: 'age'})
      });
    } else {
      super.validate(req, res, next);
    }
  }
};
