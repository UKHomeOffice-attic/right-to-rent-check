'use strict';

const reqres = require('reqres');
const behaviour = require('../../../apps/right-to-rent-check/behaviours/summary-sections');

describe('behaviours/summary-sections', () => {

  class Base {
    configure(req, res, next) {
      next();
    }
    render() {}
    getValues() {}
    emit() {}
  }

  let req;
  let res;
  let get;
  let Behaviour;
  let controller;

  const sections = {
    'foo': [{
      field: 'foo-name',
      edit: false
    }, {
      field: 'foo-email',
      edit: false
    }],
    'baz-details': [
      {
        field: 'baz',
        children: [
          'name',
          'dob',
          'country'
        ],
        uuid: 'baz-uuid',
        lists: [{
          id: 'additional-details',
          fields: [{
            name: 'reference-number',
            id: 'ref-number'
          },
            'passport-number',
            'brp-number',
          {
            name: 'recorded-delivery-number',
            id: 'delivery-number'
          }]
        }]
      }
    ],
    'bar': [
      'bar-name',
      'bar-dob'
    ]
  };

  const options = {
    steps: {
      '/step-a': {
        fields: [
          'foo-name',
          'foo-email'
        ]
      },
      '/step-b': {
        fields: [
          'name',
          'dob',
          'country'
        ]
      },
      '/step-c': {
        fields: [
          'bar-name',
          'bar-dob'
        ]
      },
      '/confirm': {
        sections: sections
      }
    },
    sections: sections
  };

  beforeEach(() => {
    get = sinon.stub();
    get.withArgs('baz').returns([{
      'name': 'john',
      'dob': '1980-01-01',
      'country': 'Qatar'
    }]);
    get.withArgs('foo-name').returns('linda');
    get.withArgs('foo-email').returns('linda@test.com');
    get.withArgs('bar-name').returns('denis');
    get.withArgs('bar-dob').returns('1980-01-01');
  });

  it('exports a function', () => {
    expect(behaviour).to.be.a('function');
  });

  describe('initialisation', () => {

    it('returns a mixin', () => {
      const Mixed = behaviour(Base);
      expect(new Mixed({
        a: 'b'
      })).to.be.an.instanceOf(Base);
    });

  });

  describe('parseSections()', () => {

    beforeEach(done => {

      const translate = sinon.stub();

      translate.withArgs([
        'pages.confirm.sections.foo.header',
        'pages.foo.header'
      ]).returns('Foo');
      translate.withArgs([
        'pages.confirm.sections.bar.header',
        'pages.bar.header'
      ]).returns('Bar');
      translate.withArgs([
        'pages.confirm.sections.baz-details.header',
        'pages.baz-details.header'
      ]).returns('Baz details');
      translate.withArgs([
        'pages.confirm.fields.name.label',
        'fields.name.summary',
        'fields.name.label',
        'fields.name.legend'
      ]).returns('Name');
      translate.withArgs([
        'pages.confirm.fields.dob.label',
        'fields.dob.summary',
        'fields.dob.label',
        'fields.dob.legend'
      ]).returns('Date of birth');
      translate.withArgs([
        'pages.confirm.fields.country.label',
        'fields.country.summary',
        'fields.country.label',
        'fields.country.legend'
      ]).returns('Country of nationality');

       translate.withArgs([
        'pages.confirm.fields.foo-name.label',
        'fields.foo-name.summary',
        'fields.foo-name.label',
        'fields.foo-name.legend'
      ]).returns('Foo name');
      translate.withArgs([
        'pages.confirm.fields.foo-email.label',
        'fields.foo-email.summary',
        'fields.foo-email.label',
        'fields.foo-email.legend'
      ]).returns('Foo email');
      translate.withArgs([
        'pages.confirm.fields.bar-name.label',
        'fields.bar-name.summary',
        'fields.bar-name.label',
        'fields.bar-name.legend'
      ]).returns('Bar name');
      translate.withArgs([
        'pages.confirm.fields.bar-dob.label',
        'fields.bar-dob.summary',
        'fields.bar-dob.label',
        'fields.bar-dob.legend'
      ]).returns('Bar date of birth');

      translate
        .withArgs('fields.foo-name.options.linda.label')
        .returns('linda');
      translate
        .withArgs('fields.foo-email.options.linda@test.com.label')
          .returns('linda@test.com');
      translate
        .withArgs('fields.bar-name.options.denis.label')
        .returns('denis');
      translate
        .withArgs('fields.bar-dob.options.1980-01-01.label')
        .returns('1980-01-01');

      req = reqres.req({
        form: {options},
        translate: translate,
        sessionModel: {get: get}
      });
      Behaviour = behaviour(Base);
      controller = new Behaviour();
      controller.configure(req, res, done);
    });

    it('returns a section groups and fields for each section', () => {
      expect(controller.parseSections(req)).to.deep.equal([{
        group: [{
          fields: [{
            field: 'foo-name',
            edit: false,
            step: '/confirm',
            value: 'linda',
            label: 'Foo name'
          }, {
            field: 'foo-email',
            edit: false,
            step: '/confirm',
            value: 'linda@test.com',
            label: 'Foo email'
          }]
        }],
        section: {
          id: 'foo',
          label: 'Foo'
        }
      }, {
        group: [{
          name: 'baz',
          fields: [{
            field: 'name',
            edit: true,
            step: '/confirm',
            value: 'john',
            label: 'Name'
          }, {
            field: 'dob',
            edit: true,
            step: '/confirm',
            value: '1980-01-01',
            label: 'Date of birth'
          }, {
            field: 'country',
            edit: true,
            step: '/confirm',
            value: 'Qatar',
            label: 'Country of nationality'
          }]
        }],
        section: {
          id: 'baz-details',
          label: 'Baz details'
        }
      }, {
        group: [{
          fields: [{
            field: 'bar-name',
            edit: true,
            step: '/confirm',
            value: 'denis',
            label: 'Bar name'
          }, {
            field: 'bar-dob',
            edit: true,
            step: '/confirm',
            value: '1980-01-01',
            label: 'Bar date of birth'
          }]
        }],
        section: {
          id: 'bar',
          label: 'Bar'
        }
      }]);
    });
  });

});
