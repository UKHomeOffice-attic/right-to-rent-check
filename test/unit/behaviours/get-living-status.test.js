'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/get-living-status');

describe('apps/right-to-rent-check/behaviours/get-living-status', () => {
    it('exports a function', () => {
      Behaviour.should.be.a('function');
    });

    class Base {
      locals() {}
    }
    let req;
    let res;
    let sessionModel;
    let instance;
    let GetLivingStatus;
    let translate;

    const superLocals = {
      tenants: [{'tenant-name': 'Mo Khan'}],
    };

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub()
      };
      translate = sinon.stub();
      res = reqres.res();
      req = reqres.req({sessionModel, translate});
      sinon.stub(Base.prototype, 'locals').returns(superLocals);
      GetLivingStatus = Behaviour(Base);
      instance = new GetLivingStatus();
    });

    afterEach(() => {
      Base.prototype.locals.restore();
    });

    describe('locals()', () => {
      describe('when a tenant is currently living in the property', () => {
        const expected = {
              tenants: [{'tenant-name': 'Mo Khan'}],
              livingStatusHeader: 'yes living',
              livingStatusId: 'yes-living-status',
              livingStatusIntro: 'intro'
            };
        let result;
        beforeEach(() => {
          req.sessionModel.get.withArgs('living-status').returns('yes');
          req.translate.withArgs('pages.request-another-tenant.yes-living-status.header').returns('yes living');
          req.translate.withArgs('pages.request-another-tenant.yes-living-status.intro').returns('intro');
          result = instance.locals(req, res);
        });
        it('has a yes living status', () => {
            result.livingStatusId.should.equal(expected.livingStatusId);
        });
        it('extends from super.locals', () => {
          result.should.deep.equal(expected);
        });
      });
      describe('when a tenant is NOT living in the property', () => {
        let result;
        const expected = {
            tenants: [{'tenant-name': 'Mo Khan'}],
            firstTenant: 'Mo Khan',
            livingStatusHeader: 'not living',
            livingStatusId: 'no-living-status',
            livingStatusIntro: 'intro'
          };
        beforeEach(() => {
          req.sessionModel.get.withArgs('living-status').returns('no');
          req.translate.withArgs('pages.request-another-tenant.no-living-status.header').returns('not living');
          req.translate.withArgs('pages.request-another-tenant.no-living-status.intro').returns('intro');
          result = instance.locals(req, res);
        });
        it('has a no living status', () => {
            result.livingStatusId.should.equal(expected.livingStatusId);
        });
        it('returns the first tenant\'s name', () => {
          result.firstTenant.should.equal(expected.firstTenant);
        });
        it('extends from super.locals()', () => {
          result.should.deep.equal(expected);
        });
      });
    });
});
