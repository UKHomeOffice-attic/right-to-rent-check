'use strict';

const _ = require('lodash');

module.exports = fields => {

  return superclass => class extends superclass {

    getValues(req, res, callback) {
      super.getValues(req, res, (err, values) => {
        if (err) {
          return callback(err);
        }

        // Find all legit fields
        const picked = _.pick(values, fields);
        // Get the list of tenants
        const tenants = req.sessionModel.get('tenants') || [];
        // Find a tenant matching the current tenant
        let tenant = _.find(tenants, picked);

        // Add a new tenant
        if (!tenant) {
          tenant = _.cloneDeep(picked);
          if (!_.isEmpty(tenant)) {
            tenants.push(tenant);
          }
        }

        // save the tenants
        req.sessionModel.set('tenants', tenants);

        callback();
      });
    }

    locals(req, res) {
      const locals = super.locals(req, res);
      locals.tenants = req.sessionModel.get('tenants');
      return locals;
    }

  };

};
