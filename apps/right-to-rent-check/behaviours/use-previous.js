'use strict';

module.exports = config => {
  const useWhen = config.useWhen;
  const previousAddress = config.previousAddress;

  if (!previousAddress) {
    throw new Error('previousAddress must be defined');
  }

  return superclass => class extends superclass {
    configure(req, res, callback) {
      super.configure(req, res, err => {
        if (req.query.step === 'postcode') {
          Object.assign(req.form.options.fields, {
            'use-previous-address': {
              mixin: 'checkbox',
              className: 'label',
              useWhen
            }
          });
        }
        callback(err);
      });
    }

    process(req, res, callback) {
      if (req.form.values['use-previous-address'] === 'true') {
        req.query.skipAddress = true;
        req.sessionModel.set(req.form.options.addressKey, req.sessionModel.get(previousAddress));
        this.successHandler(req, res);
      } else {
        super.process(req, res, callback);
      }
    }
  };
};
