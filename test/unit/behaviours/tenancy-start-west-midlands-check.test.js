'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/tenancy-start-west-midlands-check');

describe('apps/behaviours/tenancy-start-west-midlands-check', () => {
  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  class Base {
      getNextStep() {}
      saveValues() {}
    }
    let req;
    let res;
    let sessionModel;
    let instance;
    let ValidTenants;

  beforeEach(() => {
    sessionModel = {
      get: sinon.stub(),
      set: sinon.stub(),
      unset: sinon.stub()
    };
    res = reqres.res();
    req = reqres.req({sessionModel});
    sinon.stub(Base.prototype, 'getNextStep');
    sinon.stub(Base.prototype, 'saveValues');
    ValidTenants = Behaviour(Base);
    instance = new ValidTenants();
  });

  afterEach(() => {
    Base.prototype.getNextStep.restore();
    Base.prototype.saveValues.restore();
  });

  describe('getNextStep()', () => {
   it('calls the parent method when the tenancy is valid', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(true);
      instance.getNextStep(req, res);

      Base.prototype.getNextStep.should.have.been.calledWith(req, res);
    });
    it('returns the exit page if tenancy is not set to true', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(undefined);
      const result = instance.getNextStep(req, res);
      result.should.equal('/check-not-needed');
    });
  });
  describe('saveValues()', () => {
    let callback;

    beforeEach(() => {
      callback = sinon.stub();
    });

    it('if the tenancyStart is after 2016-01-31 then do NOT unset valid-tenancy', () => {
      req.form = {
        values: {
          'tenancy-start': '2017-01-01'
        }
      };
      instance.saveValues(req, res, callback);
      req.sessionModel.unset.should.not.calledWith('valid-tenancy');
    });

    it('if the tenancyStart is before 2014-12-01 set valid-tenancy to false', () => {
      req.form = {
        values: {
          'tenancy-start': '2012-01-01'
        }
      };
      instance.saveValues(req, res, callback);
      req.sessionModel.unset.should.be.calledWith('valid-tenancy');
    });

    describe('if the tenancyStart is between 2014-12-01 & 2016-01-31', () => {
      it('the postcode is in the West Midlands, do NOT set valid-tenancy to false', () => {
        req.form = {
          values: {
            'tenancy-start': '2015-01-01'
          }
        };
        req.sessionModel.get.withArgs('property-address-postcode').returns('B1 2EA');

        instance.saveValues(req, res, callback);
        req.sessionModel.unset.should.not.be.calledWith('valid-tenancy');
      });

      it(`if the tenancyStart is between 2014-12-01 & 2016-01-31 &
        the postcode is NOT in the West Midlands unset valid-tenancy`, () => {
        req.form = {
          values: {
            'tenancy-start': '2015-01-01'
          }
        };
        req.sessionModel.get.withArgs('property-address-postcode').returns('N1 2EA');

        instance.saveValues(req, res, callback);
        req.sessionModel.unset.should.be.calledWith('valid-tenancy');
      });
    });
  });
});
