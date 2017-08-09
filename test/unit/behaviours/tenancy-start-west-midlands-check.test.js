'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/tenancy-start-west-midlands-check');

describe('apps/behaviours/tenancy-start-west-midlands-check', () => {
  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  describe('getNextStep()', () => {
    class Base {
      getNextStep() {}
    }
    let req;
    let res;
    let sessionModel;
    let instance;
    let ValidTenants;

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub()
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      sinon.stub(Base.prototype, 'getNextStep');
      ValidTenants = Behaviour(Base);
      instance = new ValidTenants();
    });

    afterEach(() => {
      Base.prototype.getNextStep.restore();
    });

    it('calls super getNextStep if valid-tenancy is true', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(true);
      instance.getNextStep(req, res);

      Base.prototype.getNextStep.should.have.been.calledWith(req, res);
    });
    it('return /exit page if valid-tenancy is false', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(false);
      const result = instance.getNextStep(req, res);
      result.should.equal('/exit');
    });
  });
  describe('saveValues()', () => {
    class Base {
      saveValues() {}
    }
    let req;
    let res;
    let sessionModel;
    let instance;
    let ValidTenants;
    let callback;

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub(),
        set: sinon.stub()
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      callback = sinon.stub();

      sinon.stub(Base.prototype, 'saveValues');
      ValidTenants = Behaviour(Base);
      instance = new ValidTenants();
    });

    afterEach(() => {
      Base.prototype.saveValues.restore();
    });

    it('if the tenancyStart is after 2016-01-31 then do NOT set valid-tenancy to false', () => {
      req.form = {
        values: {
          'tenancy-start': '2017-01-01'
        }
      };
      instance.saveValues(req, res, callback);
      req.sessionModel.set.should.not.calledWith('valid-tenancy', false);
    });

    it('if the tenancyStart is before 2014-12-01 set valid-tenancy to false', () => {
      req.form = {
        values: {
          'tenancy-start': '2012-01-01'
        }
      };
      instance.saveValues(req, res, callback);
      req.sessionModel.set.should.be.calledWith('valid-tenancy', false);
    });

    it(`if the tenancyStart is between 2014-12-01 & 2016-01-31 &
      the postcode is in the West Midlands, valid-tenancy is NOT set to false`, () => {
      req.form = {
        values: {
          'tenancy-start': '2015-01-01'
        }
      };
      req.sessionModel.get.withArgs('property-address-postcode').returns('B1 2EA');

      instance.saveValues(req, res, callback);
      req.sessionModel.set.should.not.be.calledWith('valid-tenancy', false);
    });

    it(`if the tenancyStart is between 2014-12-01 & 2016-01-31 &
      the postcode is NOT in the West Midlands set valid-tenancy to false`, () => {
      req.form = {
        values: {
          'tenancy-start': '2015-01-01'
        }
      };
      req.sessionModel.get.withArgs('property-address-postcode').returns('N1 2EA');

      instance.saveValues(req, res, callback);
      req.sessionModel.set.should.be.calledWith('valid-tenancy', false);
    });
  });
});
