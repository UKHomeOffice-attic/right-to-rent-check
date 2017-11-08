'use strict';

const _ = require('lodash');

const findStep = (steps, field) => {
  return _.findKey(steps, step => {
    return step.fields && step.fields.indexOf(field) !== -1;
  });
};

module.exports = superclass => class extends superclass {

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {

      const settings = req.form.options;
      const sections = settings.sections;

      const sectionData = _.flatMap(Object.keys(sections), section => {
        return sections[section].filter(field => {
          return field.children && field.children.length;
        });
      });

      let collection;
      let metaData;
      let model;

      // an edit button has been clicked
      if (req.params.action === 'edit') {

        // redirect to the page the query field is on
        values.redirectTo = findStep(req.form.options.steps, req.query.field);
        values.redirectTo += `/edit#${req.query.field}`;

        // if an id is set, this is a collection
        if (req.params.id) {

          metaData = _.find(sectionData, section =>
            _.find(req.sessionModel.get(section.field), field =>
              field[section.uuid] === req.params.id
            )
          );

          collection = req.sessionModel.get(metaData.field);

          model = _.find(collection, {[`${metaData.uuid}`]: req.params.id});

          // remove the tenant from the values and additional details list
          values = _.omit(values, metaData.children.concat(metaData.uuid));

          if (model) {
            // add the new model to the values
            Object.assign(values, model);

            // update any lists associated with the collection
            metaData.lists.forEach(list => {
              values[list.id] = _.reduce(list.fields, (result, field) => {
                const name = field.name || field;
                const id = field.id || name;
                if (values[name]) {
                  result.push(id);
                }
                return result;
              }, []);
            });
          }
        }
      } else {
        metaData = _.find(sectionData, section => values[section.uuid]);
        if (metaData) {
          collection = req.sessionModel.get((metaData || {}).field);
          values = _.omit(values, 'redirectTo');
          model = _.pick(values, metaData.children.concat(metaData.uuid));

          // update the tenants
          if (_.isEmpty(model) === false) {
            collection.splice(_.findIndex(collection, {
              [`${metaData.uuid}`]: values[metaData.uuid]
            }), 1, model);
          }
          values[metaData.field] = collection;
        }
      }
      req.sessionModel.set(values);
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
};
