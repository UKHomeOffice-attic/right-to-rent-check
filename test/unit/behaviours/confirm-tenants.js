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
    'landlord': [{
      field: 'landlord-name',
      edit: false
    }, {
      field: 'landlord-email',
      edit: false
    }],
    'tenant-details': [
      {
        field: 'tenants',
        children: [
          'name',
          { field: 'dob', parse: date => date },
          'country'
        ],
        uuid: 'tenant-uuid',
        lists: [
          {
            id: 'additional-details',
            fields: [
              {
                name: 'reference-number',
                id: 'ref-number'
              },
              'passport-number',
              'brp-number',
              {
                name: 'recorded-delivery-number',
                id: 'delivery-number'
              }
            ]
          }
        ]
      }
    ],
    'other-details': [
      'other-name',
      { field: 'other-dob', parse: date => date }
    ]
  };

  const options = {
    steps: {
      '/step-a': {
        fields: [
          'landlord-name',
          'landlord-email'
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
          'other-name',
          'other-dob'
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
    get.withArgs('tenants').returns([{
      'name': 'john',
      'dob': '1980-01-01',
      'country': 'Qatar'
    }]);
    get.withArgs('landlord-name').returns('linda');
    get.withArgs('landlord-email').returns('linda@test.com');
    get.withArgs('other-name').returns('denis');
    get.withArgs('other-dob').returns('1980-01-01');
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
      name: 'tenant a edited',
      dob: '1980-01-01',
      country: 'fr',
      'tenant-uuid': '1234567890',
      'reference-number': 'abc123',
      'recorded-delivery-number': '123xyz',
      'passport-number': '11111111'
    };

    beforeEach(() => {
      get.withArgs('tenants').returns([{
        name: 'tenant a',
        dob: '1970-01-01',
        country: 'uk',
        'tenant-uuid': '1234567890'
      }, {
        name: 'tenant b',
        dob: '1999-01-01',
        country: 'uk',
        'tenant-uuid': '0987654321'
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
        req.query.field = 'other-name';
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0]).to.include({
            redirectTo: '/step-c/edit#other-name'
          });
          done();
        });
      });

      it('a model is merged with the values if the params id matches a model\'s id', (done) => {
        req.params.action = 'edit';
        req.params.id = '1234567890';
        req.query.field = 'other-name';
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set.args[0][0]).to.include({
            name: 'tenant a',
            dob: '1970-01-01',
            'tenant-uuid': '1234567890'
          });
          done();
        });
      });

      it('creates a list for each collection with checkboxes', (done) => {
        req.params.action = 'edit';
        req.params.id = '1234567890';
        req.query.field = 'other-name';
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

      it('the collections are updated with the values extended from the top-level model', (done) => {
        controller.getValues(req, res, (err) => {
          expect(err).to.not.exist;
          expect(req.sessionModel.set).to.have.been.calledWith('tenants', [
            {
              name: 'tenant a edited',
              dob: '1980-01-01',
              country: 'fr',
              'tenant-uuid': '1234567890'
            }, {
              name: 'tenant b',
              dob: '1999-01-01',
              country: 'uk',
             'tenant-uuid': '0987654321'
            }
          ]);
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
