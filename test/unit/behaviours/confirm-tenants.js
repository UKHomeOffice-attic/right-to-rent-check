'use strict';

const reqres = require('reqres');
const behaviour = require('../../../apps/right-to-rent-check/behaviours/confirm-tenants');

describe('behaviours/confirm-tenants', () => {

  class Base {
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

    beforeEach(() => {
      res = reqres.res();
      req = reqres.req({
        form: {options},
        translate: translate,
        sessionModel: {get: get}
      });
      Behaviour = behaviour(Base);
      controller = new Behaviour();
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

  describe('render()', () => {

    const callback = sinon.stub();

    beforeEach(() => {
      res = reqres.res();
      req = reqres.req({
        form: {options},
        sessionModel: {
          get: get,
          unset: sinon.stub()
        }
      });
      sinon.stub(Base.prototype, 'render');
      sinon.stub(Base.prototype, 'emit');
      Behaviour = behaviour(Base);
      controller = new Behaviour();
    });

    afterEach(() => {
      Base.prototype.render.restore();
      Base.prototype.emit.restore();
    });

    describe('when redirectTo is not set', () => {
      it('calls the parent method', () => {
        controller.render(req, res, callback);
        expect(Base.prototype.render).to.have.been.calledWith(req, res, callback);
      });
    });

    describe('when redirectTo is set', () => {
      const redirectTo = '/test';

      it('unsets redirectTo from the model', () => {
        req.sessionModel.get.withArgs('redirectTo').returns(redirectTo);
        controller.render(req, res, callback);
        expect(req.sessionModel.unset).to.have.been.calledWith('redirectTo');
      });

      it('emits a complete event', () => {
        req.sessionModel.get.withArgs('redirectTo').returns(redirectTo);
        controller.render(req, res, callback);
        expect(Base.prototype.emit).to.have.been.calledWith('complete', req, res);
      });

      it('redirects to redirectTo', () => {
        req.sessionModel.get.withArgs('redirectTo').returns(redirectTo);
        controller.render(req, res, callback);
        expect(res.redirect).to.have.been.calledWith(redirectTo);
      });

    });

  });

  describe('getValues()', () => {

    const values = {
      name: 'baz a',
      dob: '1980-01-01',
      country: 'uk',
      'baz-uuid': '1234567890',
      'reference-number': 'abc123',
      'recorded-delivery-number': '123xyz',
      'passport-number': '11111111'
    };

    beforeEach(() => {
      get.withArgs('baz').returns([{
        name: 'baz a',
        dob: '1970-01-01',
        country: 'uk',
        'baz-uuid': '1234567890'
      }, {
        name: 'baz b',
        dob: '1999-01-01',
        country: 'uk',
        'baz-uuid': '0987654321'
      }]);
      res = reqres.res();
      req = reqres.req({
        form: {options},
        sessionModel: {
          get: get,
          set: sinon.stub()
        }
      });
      sinon.stub(Base.prototype, 'getValues').yields(null, values);
      Behaviour = behaviour(Base);
      controller = new Behaviour();
    });

    afterEach(() => {
      Base.prototype.getValues.restore();
    });

    describe('when editting', () => {

      it('a redirectTo path property is set on values', (done) => {
        req.params.action = 'edit';
        req.query.field = 'bar-name';
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0]).to.include({
            redirectTo: '/step-c/edit#bar-name'
          });
          done();
        });
      });

      it('a model is merged with the values if the params id matches a model\'s id', (done) => {
        req.params.action = 'edit';
        req.params.id = '1234567890';
        req.query.field = 'bar-name';
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0]).to.include({
            name: 'baz a',
            dob: '1970-01-01',
            'baz-uuid': '1234567890'
          });
          done();
        });
      });

      it('creates a list for each collection with checkboxes', (done) => {
        req.params.action = 'edit';
        req.params.id = '1234567890';
        req.query.field = 'bar-name';
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0]['additional-details']).to.deep.equal([
            'ref-number',
            'passport-number',
            'delivery-number'
          ]);
          done();
        });
      });

    });

    describe('when loading', () => {

      it('the collections are updated with the appropriate values', (done) => {
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set).to.have.been.calledWith({
            name: 'baz a',
            dob: '1980-01-01',
            country: 'uk',
            'baz-uuid': '1234567890',
            'recorded-delivery-number': '123xyz',
            'reference-number': 'abc123',
            'passport-number': '11111111',
            baz: [{
              name: 'baz a',
              dob: '1980-01-01',
              country: 'uk',
              'baz-uuid': '1234567890'
            }, {
              name: 'baz b',
              dob: '1999-01-01',
              country: 'uk',
             'baz-uuid': '0987654321'
            }]
          });
          done();
        });
      });

      it('the property is removed from the values', (done) => {
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0].redirectTo).to.not.exist;
          done();
        });
      });

    });

  });

});
