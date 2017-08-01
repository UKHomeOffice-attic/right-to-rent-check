'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/tenants');

describe('behaviours/tenants', () => {

  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  describe('initialisation', () => {

    it('returns a mixin', () => {
      const fields = ['tenant-name'];
      class Base {}
      const Mixed = Behaviour(fields)(Base);
      expect(new Mixed()).to.be.an.instanceOf(Base);
    });

  });

  describe('locals', () => {

    class Base {
      locals() {}
    }
    let sessionModel;
    let controller;
    let Tenants;
    let req;
    let res;
    const superLocals = {
      foo: 'bar'
    };

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub()
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      sinon.stub(Base.prototype, 'locals').returns(superLocals);
      Tenants = Behaviour()(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.locals.restore();
    });

    it('returns locals extended from super with tenants', () => {

      const tenants = [{
        'tenant-name': 'john smith',
        'tenant-age': '24'
      }];

      req.sessionModel.get.withArgs('tenants').returns(tenants);

      expect(controller.locals(req, res)).to.deep.equal(Object.assign(superLocals, {
        tenants: tenants
      }));

    });
  });

  describe('getValues', () => {

    class Base {
      getValues() {}
    }
    let fields;
    let sessionModel;
    let controller;
    let Tenants;
    let req;
    let res;
    let values = {};
    let superGetValues;

    beforeEach(() => {
      fields = [
        'tenant-name',
        'tenant-age'
      ];
      sessionModel = {
        get: sinon.stub(),
        set: sinon.stub(),
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      superGetValues = sinon.stub(Base.prototype, 'getValues');
      Tenants = Behaviour(fields)(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.getValues.restore();
    });

    it('modifies the values with the tenants collection', (done) => {

      values = {
        'tenant-name': 'john smith',
        'tenant-age': '24',
        'foo': 'bar'
      };

      superGetValues.yields(null, values);

      const tenants = [{
        'tenant-name': 'john smith',
        'tenant-age': '24'
      }];

      controller.getValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledWith('tenants', tenants);
        done();
      });

    });

    it('adds new tenants', (done) => {

      req.sessionModel.get.withArgs('tenants').returns([{
        'tenant-name': 'John Smythe',
        'tenant-age': '42',
        'uuid': '123456789'
      }]);

      values = {
        'tenant-name': 'John Smith',
        'tenant-age': '24'
      };

      superGetValues.yields(null, values);

      const tenants = [{
        'tenant-name': 'John Smythe',
        'tenant-age': '42',
        'uuid': '123456789'
      }, {
        'tenant-name': 'John Smith',
        'tenant-age': '24'
      }];

      controller.getValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledWith('tenants', tenants);
        done();
      });

    });

  });

});
