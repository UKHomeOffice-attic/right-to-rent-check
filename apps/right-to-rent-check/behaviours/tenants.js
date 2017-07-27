'use strict';

const _ = require('lodash');

module.exports = fields => {

  return superclass => class extends superclass {

    saveValues(req, res, callback) {
      const name = req.body['tenant-name'];
      const tenants = req.sessionModel.get('tenants') || [];

      let tenant = _.find(tenants, {'tenant-name': name});
      if (!tenant) {
        tenant = fields.length ? _.pick(req.body, fields) : req.body;
        if (!_.isEmpty(tenant)) {
          tenants.push(tenant);
        }
      } else {
        Object.assign(tenant, _.pick(req.body, fields));
      }

      req.sessionModel.set('tenants', tenants);

      super.saveValues(req, res, callback);
    }

  };

};
