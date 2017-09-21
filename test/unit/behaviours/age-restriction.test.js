'use strict';

const reqres = require('reqres');
const Behavior = require('../../../apps/right-to-rent-check/behaviours/age-restriction');
const moment = require('moment');

describe('apps/behaviours/age-restriction', () => {
  it('exports a function', () => {
    expect(Behavior).to.be.a('function');
  });

  class Base {
    validate() {}
    ValidationError() {}
  }
  let req;
  let res;
  let AgeRestriction;
  let instance;
  let ValidationError;

  beforeEach(() => {
    res = reqres.res();
    req = reqres.req({
      form: {
        values: {}
      }
    });
    AgeRestriction = Behavior(Base);
    instance = new AgeRestriction();
    sinon.stub(Base.prototype, 'validate').yields();
    ValidationError = sinon.stub(Base.prototype, 'ValidationError');
  });
  afterEach(() => {
    Base.prototype.validate.restore();
    Base.prototype.ValidationError.restore();
  });

  describe('validate()', () => {
    it('calls parent method when tenant is older than 17 years 11 months', (done) => {
      const validDob = moment('1990-12-01');
      req.form.values['tenant-dob'] = validDob;
      instance.validate(req, res, (err) => {
        expect(err).not.to.exist;
        Base.prototype.validate.should.have.been.calledWith(req, res);
        done();
      });
    });
    it('when the tenant is younger than than 17 years 11 months', (done) => {
      let invalidDob = moment().subtract(1, 'months');
      req.form.values['tenant-dob'] = invalidDob;
      instance.validate(req, res, (err) => {
        expect(err).to.exist;
        err['tenant-dob'].should.be.an.instanceOf(Base.prototype.ValidationError);
        ValidationError.should.have.been.calledWith('tenant-dob', {type: 'age'});
        done();
      });
    });
  });
});
