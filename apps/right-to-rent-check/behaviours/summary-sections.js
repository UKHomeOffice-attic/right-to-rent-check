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

const isTruthy = (model, field) => {
  field = typeof field === 'object' ? field.field : field;
  const value = model.get(field);
  return value !== '' && value !== null && value !== undefined;
};

module.exports = Base => class extends mix(Base).with(Behaviour) {

  configure(req, res, next) {
    super.configure(req, res, err => {
      if (err) {
        return next(err);
      }
      req.form.options.translationKey = req.form.options.translationKey || 'confirm';
      next();
    });
  }

  parseSections(req) {
    const settings = req.form.options;
    const sections = this.getSectionSettings(settings);
    return Object.keys(sections)
      .map(section => {
        const fields = sections[section] || [];
        return {
          section: {
            label: req.translate([
              `pages.${settings.translationKey}.sections.${section}.header`,
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
          `pages.${settings.translationKey}.fields.${key}.label`,
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

};
