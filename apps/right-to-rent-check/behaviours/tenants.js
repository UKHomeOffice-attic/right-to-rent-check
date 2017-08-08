'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');

module.exports = fields => {

  return superclass => class extends superclass {

    getValues(req, res, callback) {
      super.getValues(req, res, (err, values) => {
        if (err) {
          return callback(err);
        }

        // Find values with keys in the list of fields
        let tenant = _.pick(values, fields);

        // Get the list of tenants
        const tenants = req.sessionModel.get('tenants') || [];

        const savedByUuid = _.find(tenants, {'tenant-uuid': values['tenant-uuid']});

        // Have we just finished editting a tenant record
        // or is our savedByUuid different from the current tenant
        const editted = _.find(tenants, {edit: true}) ||
          (!_.isEqual(_.omit(savedByUuid, 'edit', 'tenant-uuid'), tenant) ? savedByUuid : false);

        // when a user has selected the change button
        if (req.params.action === 'edit') {

          // find the tenant the user wants to edit
          tenant = _.find(tenants, {'tenant-uuid': req.params.id});

          // set the the tenant to be editted to the current values
          // to ensure they are the values that are rendered
          // when the edit step is loaded
          Object.assign(values, _.pick(tenant, fields));

          // find the step containing the field to edit
          values.redirectTo = _.findKey(this.options.steps, (step) => {
            return step.fields && step.fields.indexOf(req.query.field) !== -1;
          });

          // add hash field name to the url.
          values.redirectTo += `#${req.query.field}`;

          // flag for editted
          tenant.edit = true;

          // replace the tenant the user want to edit
          // with the updated for editted tenant
          tenants.splice(_.findIndex(tenants, {'tenant-uuid': req.params.id}), 1, tenant);

        // After a tenant record has been editted,
        // either by way of the back link or a 'change' link
        } else if (editted) {

          // make sure the replacer and valeus have the same uuids
          tenant['tenant-uuid'] = values['tenant-uuid'] = editted['tenant-uuid'];

          // reset its edit state
          tenant.edit = false;

          // replace the edittable tenant
          tenants.splice(_.findIndex(tenants, editted), 1, tenant);

        // when the tenant does not exist yet
        } else if (!_.find(tenants, tenant)) {

          tenant.edit = false;

          // add a uuid to the new tenant
          tenant['tenant-uuid'] = values['tenant-uuid'] = uuid();
          tenants.push(tenant);

        } else {
          // the tenant exists and no changes have been made
          return callback();
        }

        // Update the current values with the tenants
        values.tenants = tenants;

        // update the values
        req.sessionModel.set(values);

        callback();
      });
    }

    saveValues(req, res, callback) {
      req.sessionModel.unset(fields.concat('tenant-uuid', 'redirectTo'));
      callback();
    }

    render(req, res, callback) {
      if (req.params.action === 'edit') {
        this.emit('complete', req, res);
        res.redirect(req.sessionModel.get('redirectTo'));
      } else {
        super.render(req, res, callback);
      }
    }

    locals(req, res) {
      const locals = super.locals(req, res);
      locals.tenants = req.sessionModel.get('tenants');
      return locals;
    }

  };

};
