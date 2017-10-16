'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');

// Find the step that includes the field
const findStep = (steps, field) =>
  _.findKey(steps, step =>
    step.fields && step.fields.indexOf(field) !== -1
  );

// Have we just finished editting a tenant record
// or is our saved tenant different from the current tenant
const isEditted = (tenants, tenant, id) => {
  let found = _.find(tenants, {edit: true});
  if (!found) {
    found = _.find(tenants, {'tenant-uuid': id});
    if (found) {
      if (found.edit) {
        tenant.edit = found.edit;
      }
      tenant['tenant-uuid'] = found['tenant-uuid'];
      return _.isEqual(found, tenant) ? false : tenant;
    }
  }
  return found;
};

const isNewTenant = (tenants, tenant) => {
  const found = _.find(tenants, {'tenant-uuid': tenant['tenant-uuid']});
  const empty = _.some(_.values(tenant), value => _.identity(value));
  // when the tenant does not exist
  // and the tenant values aren't empty
  return !found && empty;
};

module.exports = fields => {

  return superclass => class extends superclass {

    getValues(req, res, callback) {
      super.getValues(req, res, (err, values) => {
        if (err) {
          return callback(err);
        }

        let tenant = _.pick(values, fields);
        let tenants = req.sessionModel.get('tenants') || [];

        const edittedTenant = isEditted(tenants, tenant, values['tenant-uuid']);

        // when a user has selected the change button
        if (req.params.action === 'edit' && req.params.id) {
          // Find the tenant the user wants to edit
          tenant = _.find(tenants, {'tenant-uuid': req.params.id});

          // Assign the tenant to the current values
          // to ensure they are the values that are rendered
          // when the edit step is loaded
          Object.assign(values, tenant);

          // find the step containing the field to edit
          values.redirectTo = findStep(this.options.steps, req.query.field);

          values.redirectTo += `#${req.query.field}`;
          tenant.edit = true;

          // replace the tenant the user want to edit
          // with the updated for edittedTenant tenant
          tenants.splice(_.findIndex(tenants, {
            'tenant-uuid': req.params.id
          }), 1, tenant);

        } else if (req.params.action === 'delete') {

          // delete the tenant we just actioned
          tenants = _.reject(tenants, {
            'tenant-uuid': req.params.id
          });

          const allFields = fields.concat('tenant-uuid', 'tenant-additional-details');

          // when no more tenants, redirect to the start
          if (tenants.length === 0) {
            req.sessionModel.set('redirectTo', '/tenant-details');
            req.sessionModel.unset(allFields);
          }

          // if deleting the last added tenant
          // remove the tenant from the values too
          if (values['tenant-uuid'] === req.params.id) {
            req.sessionModel.unset(allFields);
          }

          // reset the tenants
          req.sessionModel.set('tenants', tenants);
          return callback();

        // After a tenant record has been edittedTenant,
        // either by way of the back link or a 'change' link
        } else if (edittedTenant) {
          // make sure the replacer and values have the same uuids
          tenant['tenant-uuid'] = values['tenant-uuid'] = edittedTenant['tenant-uuid'];
          tenants.splice(_.findIndex(tenants, edittedTenant), 1, tenant);

        } else if (isNewTenant(tenants, tenant)) {
          tenant.edit = false;
          tenant['tenant-uuid'] = values['tenant-uuid'] = uuid();
          tenants.push(tenant);
        } else {
          // the tenant exists and no changes have been made
          return callback();
        }

        // Update the current values with the tenants
        values.tenants = tenants;

        req.sessionModel.set(values);
        callback();
      });
    }

    saveValues(req, res, callback) {
      super.saveValues(req, res, (err) => {
        req.sessionModel.unset(fields.concat('tenant-uuid', 'redirectTo'));
        callback(err);
      });
    }

    render(req, res, callback) {
      const redirectTo = req.sessionModel.get('redirectTo');
      if (redirectTo) {
        req.sessionModel.unset('redirectTo');
        this.emit('complete', req, res);
        res.redirect(redirectTo);
      } else {
        super.render(req, res, callback);
      }
    }

    locals(req, res) {
      const locals = super.locals(req, res);
      locals.tenants = req.sessionModel.get('tenants');
      if (locals.tenants.length) {
        locals.hasTenants = true;
      }
      return locals;
    }

  };

};
