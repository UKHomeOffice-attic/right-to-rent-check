'use strict';

const mix = require('mixwith').mix;
const Behaviour = require('hof-behaviour-summary-page');
const _ = require('lodash');

const getValue = (value, field, translate) => {
  const key = `fields.${field}.options.${value}.label`;
  let result = translate(key);
  if (result === key) {
    result = value;
  }
  return result;
};

const findStep = (steps, field) => {
  return _.findKey(steps, step => {
    return step.fields && step.fields.indexOf(field) !== -1;
  });
};

const isTruthy = (model, field) => {
  field = typeof field === 'object' ? field.field : field;
  const value = model.get(field);
  return value !== '' && value !== null && value !== undefined;
};

module.exports = Base => class extends mix(Base).with(Behaviour) {

  parseSections(req) {
    const settings = req.form.options;
    const sections = this.getSectionSettings(settings);
    return Object.keys(sections)
      .map(section => {
        const fields = sections[section] || [];
        return {
          section: {
            label: req.translate([
              `pages.confirm.sections.${section}.header`,
              `pages.${section}.header`
            ]),
            id: section
          },
          group: (() => {
            if (fields.some(field => field.children)) {
              return _.flatMap(fields, field =>
                _.map(req.sessionModel.get(field.field), (val, index) => ({
                  name: field.field,
                  fields: this.getFields(fields, req, index)
                }))
              );
            }
            return [{
              fields: this.getFields(fields, req)
            }];
          }).call()
        };
      }).filter(section => section.group.every(entity => entity.fields.length));
  }

  getFields(fields, req, childIndex) {
    return _.flatten(fields.filter(field => isTruthy(req.sessionModel, field))
      .map(field => this.getFieldData(field, req, childIndex))).filter(f => f.value);
  }

  getFieldData(key, req, childIndex) {
    if (key.children) {
      const children = req.sessionModel.get(key.field)[childIndex];
      return _.flatMap([children], child => {
        if (child[key.uuid]) {
          key.id = child[key.uuid];
        }
        const fields = _.map(key.children, item => item.field || item);
        const selected = _.pick(child, fields);

        return _.map(selected, (val, id) => {
          id = _.find(key.children, kid => kid.field === id) || id;
          val = val || req.translate(req.form.options.nullValue);

          return this.getData(id, req, val, key);
        });
      });
    }
    return this.getData(key, req);
  }

  getData(key, req, value, field) {
    value = value || getValue(req.sessionModel.get(key), key, req.translate);
    const settings = req.form.options;
    if (typeof key === 'string') {
      const data = {
        label: req.translate([
          `pages.confirm.fields.${key}.label`,
          `fields.${key}.summary`,
          `fields.${key}.label`,
          `fields.${key}.legend`
        ]),
        value: value || req.translate(settings.nullValue) || settings.nullValue,
        step: '/confirm',
        field: key,
        edit: true,
      };
      if (field && field.id) {
        data.uuid = `/${field.id}`;
      }
      return data;
    }
    if (typeof key.field === 'string') {
      const obj = Object.assign(this.getData(key.field, req, value, field), key);
      if (typeof key.parse === 'function') {
        obj.value = key.parse(obj.value);
      }
      obj.edit = typeof key.edit === 'boolean' ? key.edit : true;
      return obj;
    }
    return {};
  }

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {

      const settings = req.form.options;
      const sections = this.getSectionSettings(settings);

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
