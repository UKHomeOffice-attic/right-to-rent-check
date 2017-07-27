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

  describe('saveValues', () => {

    class Base {
      saveValues() {}
    }
    let fields;
    let sessionModel;
    let controller;
    let Tenants;
    let req;
    let res;

    beforeEach(() => {
      fields = [
        'tenant-name',
        'tenant-age',
        'tenant-address'
      ];
      sessionModel = {
        get: sinon.stub(),
        set: sinon.stub(),
      };
      res = reqres.res();
      sinon.stub(Base.prototype, 'saveValues').yields();
      Tenants = Behaviour(fields)(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.saveValues.restore();
    });

    it('saves a collection of tenants to the sessionModel', (done) => {

      req = reqres.req({
        sessionModel,
        body: {
          'tenant-name': 'john smith',
          'tenant-age': '24'
        }
      });

      const tenants = [{
        'tenant-name': 'john smith',
        'tenant-age': '24'
      }];

      controller.saveValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledOnce;
        expect(req.sessionModel.set.args[0][0]).to.equal('tenants');
        expect(req.sessionModel.set.args[0][1]).to.deep.equal(tenants);
        done();
      });

    });

    it('calls super.saveValues with the request and response objects', (done) => {

      req = reqres.req({
        sessionModel,
        body: {
          'tenant-name': 'john smith',
          'tenant-age': '24'
        }
      });

      controller.saveValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(Base.prototype.saveValues).to.have.been.calledWith(
          req,
          res,
          sinon.match.func
        );
        done();
      });

    });

    it('updates existing tenants', (done) => {

      sessionModel.get.returns([{
        'tenant-name': 'John Smith',
        'tenant-age': '42'
      }]);

      req = reqres.req({
        sessionModel,
        body: {
          'tenant-name': 'John Smith',
          'tenant-age': '42',
          'tenant-address': 'London'
        }
      });

      const tenants = [{
        'tenant-name': 'John Smith',
        'tenant-age': '42',
        'tenant-address': 'London'
      }];

      controller.saveValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledOnce;
        expect(req.sessionModel.set.args[0][0]).to.equal('tenants');
        expect(req.sessionModel.set.args[0][1]).to.deep.equal(tenants);
        done();
      });

    });

    it('adds new tenants', (done) => {

      sessionModel.get.returns([{
        'tenant-name': 'John Smith',
        'tenant-age': '42'
      }]);

      req = reqres.req({
        sessionModel,
        body: {
          'tenant-name': 'Karen Smith',
          'tenant-age': '43'
        }
      });

      const tenants = [{
        'tenant-age': '42',
        'tenant-name': 'John Smith'
      }, {
        'tenant-age': '43',
        'tenant-name': 'Karen Smith'
      }];

      controller.saveValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledOnce;
        expect(req.sessionModel.set.args[0][0]).to.equal('tenants');
        expect(req.sessionModel.set.args[0][1]).to.deep.equal(tenants);
        done();
      });

    });

    it('adds configured fields', (done) => {

      fields = [
        'tenant-name',
        'tenant-age',
      ];

      Tenants = Behaviour(fields)(Base);
      controller = new Tenants();

      req = reqres.req({
        sessionModel,
        body: {
          'tenant-name': 'Karen Smith',
          'tenant-age': '43',
          'not-a-field': true
        }
      });

      const tenants = [{
        'tenant-name': 'Karen Smith',
          'tenant-age': '43',
      }];

      controller.saveValues(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.sessionModel.set).to.have.been.calledOnce;
        expect(req.sessionModel.set.args[0][0]).to.equal('tenants');
        expect(req.sessionModel.set.args[0][1]).to.deep.equal(tenants);
        done();
      });

    });

  });

});
