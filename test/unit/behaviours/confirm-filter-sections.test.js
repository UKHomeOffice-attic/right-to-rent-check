'use strict';
const reqres = require('hof-util-reqres');
const FilterSections = require('../../../apps/right-to-rent-check/behaviours/confirm-filter-sections');

class Base {
  configure() {}
}
const Controller = FilterSections(Base);

describe('Filter Sections', () => {

  let req;
  let res;
  let instance;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
    instance = new Controller();
    sinon.stub(Base.prototype, 'configure').yieldsAsync();
  });

  afterEach(() => {
    Base.prototype.configure.restore();
  });

  describe('configure', () => {

    it('removes the `agent-details` section from the sections if representative is `landlord`', done => {
      req.form.options.sections = {
        'agent-details': {},
        'other-details': {}
      };
      req.sessionModel.set('representative', 'landlord');
      instance.configure(req, res, () => {
        req.form.options.sections.should.not.have.property('agent-details');
        req.form.options.sections.should.have.property('other-details');
        done();
      });
    });

    it('preserves the `agent-details` section from the sections if representative is not `landlord`', done => {
      req.form.options.sections = {
        'agent-details': {},
        'other-details': {}
      };
      instance.configure(req, res, () => {
        req.form.options.sections.should.have.property('agent-details');
        req.form.options.sections['agent-details'].should.eql({});
        done();
      });
    });

    it('does nothing if sections if not defined', done => {
      instance.configure(req, res, () => {
        done();
      });
    });

    it('passes through any error from the parent method', done => {
      const err = new Error('test error');
      Base.prototype.configure.yieldsAsync(err);
      instance.configure(req, res, e => {
        e.should.equal(err);
        done();
      });
    });

  });

});
