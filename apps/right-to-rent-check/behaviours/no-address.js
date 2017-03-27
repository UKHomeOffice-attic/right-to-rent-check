'use strict';

module.exports = config => superclass => class extends superclass {

  configure(req, res, callback) {
    super.configure(req, res, err => {
      if (req.query.step === 'postcode') {
        Object.assign(req.form.options.fields, {
          'no-address': Object.assign({ mixin: 'checkbox' }, config.fieldConfig)
        });
      }
      callback(err);
    });
  }

  process(req, res, callback) {
    if (req.form.values['no-address'] === 'true') {
      req.sessionModel.unset(req.form.options.addressKey);
      this.successHandler(req, res, callback);
    } else {
      super.process(req, res, callback);
    }
  }
};
