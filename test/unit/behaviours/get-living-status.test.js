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

    describe('locals', () => {
      it('returns an extended locals when a tenant is currently living in the property', () => {
          const expected = {
            tenants: [{'tenant-name': 'Mo Khan'}],
            livingStatusHeader: 'yes living',
            livingStatusIntro: 'intro'
          };
          req.sessionModel.get.withArgs('living-status').returns('yes');
          req.translate.withArgs('pages.request-another-tenant.yes-living-status.header').returns('yes living');
          req.translate.withArgs('pages.request-another-tenant.yes-living-status.intro').returns('intro');
          const result = instance.locals(req, res);
          result.should.deep.equal(expected);
      });

      it(`returns an extended locals which includes the first tenant\'s name when a tenant
        is NOT living in the property`, () => {
        const expected = {
          tenants: [{'tenant-name': 'Mo Khan'}],
          firstTenant: 'Mo Khan',
          livingStatusHeader: 'not living',
          livingStatusIntro: 'intro'
        };
        req.sessionModel.get.withArgs('living-status').returns('no');
        req.translate.withArgs('pages.request-another-tenant.no-living-status.header').returns('not living');
        req.translate.withArgs('pages.request-another-tenant.no-living-status.intro').returns('intro');
        const result = instance.locals(req, res);
        result.should.deep.equal(expected);
      });
    });
});
