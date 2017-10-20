'use strict';

module.exports = superclass => class extends superclass {

  configure(req, res, callback) {
    super.configure(req, res, err => {
      // do not display agent details section if landlord is filling form
      if (req.form.options.sections && req.sessionModel.get('representative') === 'landlord') {
        delete req.form.options.sections['agent-details'];
      }
      callback(err);
    });
  }

};
