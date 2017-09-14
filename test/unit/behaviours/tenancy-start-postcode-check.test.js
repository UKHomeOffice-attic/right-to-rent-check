'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/tenancy-start-postcode-check');

describe('apps/behaviours/tenancy-start-postcode-check', () => {
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
    ValidTenants = Behaviour(Base);
    instance = new ValidTenants();
  });

  describe('getNextStep()', () => {
    beforeEach(() => {
      sinon.stub(Base.prototype, 'getNextStep');
    });
    afterEach(() => {
      Base.prototype.getNextStep.restore();
    });

    it('calls the parent method when the tenancy is valid & unsets the valid-tenancy', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(true);
      instance.getNextStep(req, res);

      Base.prototype.getNextStep.should.have.been.calledWith(req, res);
    });

    it('unsets the valid-tenancy at the end when the tenancy is valid', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(true);
      instance.getNextStep(req, res);

      req.sessionModel.unset.should.have.been.calledWith('valid-tenancy');
    });

    it('returns the exit page if tenancy is not set to true', () => {
      req.sessionModel.get.withArgs('valid-tenancy').returns(undefined);
      const result = instance.getNextStep(req, res);
      result.should.equal('/check-not-needed-date');
    });
  });
  describe('saveValues()', () => {

    beforeEach(() => {
      sinon.stub(Base.prototype, 'saveValues').yields();
    });
    afterEach(() => {
      Base.prototype.saveValues.restore();
    });

    it('if the tenancyStart is after 2016-01-31 then do NOT unset valid-tenancy', (done) => {
      req.form = {
        values: {
          'tenancy-start': '2017-01-01'
        }
      };
      instance.saveValues(req, res, () => {
        req.sessionModel.set.should.be.calledWith('valid-tenancy', true);
        done();
      });
    });

    it('if the tenancyStart is before 2014-12-01 do NOT set valid-tenancy', (done) => {
      req.form = {
        values: {
          'tenancy-start': '2012-01-01'
        }
      };
      instance.saveValues(req, res, () => {
        req.sessionModel.set.should.not.be.calledWith('valid-tenancy', true);
        done();
      });
    });

    describe('if the tenancyStart is between 2014-12-01 & 2016-01-31', () => {
      it('the postcode is in the West Midlands, set valid-tenancy to true', (done) => {
        req.form = {
          values: {
            'tenancy-start': '2015-01-01'
          }
        };
        req.sessionModel.get.withArgs('property-address-postcode').returns('B1 2EA');

        instance.saveValues(req, res, () => {
          req.sessionModel.set.should.be.calledWith('valid-tenancy', true);
          done();
        });
      });

      it(`if the tenancyStart is between 2014-12-01 & 2016-01-31 &
        the postcode is NOT in the West Midlands do NOT set valid-tenancy to true`, (done) => {
        req.form = {
          values: {
            'tenancy-start': '2015-01-01'
          }
        };
        req.sessionModel.get.withArgs('property-address-postcode').returns('N1 2EA');

        instance.saveValues(req, res, () => {
          req.sessionModel.set.should.not.be.calledWith('valid-tenancy', true);
          done();
        });
      });
    });
  });
});
