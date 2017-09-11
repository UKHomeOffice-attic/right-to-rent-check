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
  let next;
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
    next = sinon.stub();
    AgeRestriction = Behavior(Base);
    instance = new AgeRestriction();
    sinon.stub(Base.prototype, 'validate');
    ValidationError = sinon.stub(Base.prototype, 'ValidationError');
  });
  afterEach(() => {
    Base.prototype.validate.restore();
    Base.prototype.ValidationError.restore();
  });

  describe('validate()', () => {
    it('calls parent method when tenant date of birth is greater than 17 years 11 months', () => {
      const validDob = moment('1990-12-01');
      req.form.values['tenant-dob'] = validDob;
      instance.validate(req, res);

      Base.prototype.validate.should.have.been.calledWith(req, res);
    });
    describe('when the tenant\'s date of birth is less than than 17 years 11 months', () => {
      let invalidDob = moment().subtract(1, 'months');

      it('calls next', () => {
        req.form.values['tenant-dob'] = invalidDob;
        instance.validate(req, res, next);
        next.should.have.been.called;
      });

      describe('the next function', () => {
        it('has a property of tenant-dob which is an instance of ValidationError', () => {
          req.form.values['tenant-dob'] = invalidDob;
          instance.validate(req, res, next);
          next.getCall(0).args[0]['tenant-dob'].should.be.an.instanceOf(Base.prototype.ValidationError);
        });

        it('ValidationError is called with the field tenant-dob with the validation type age', () => {
          req.form.values['tenant-dob'] = invalidDob;
          instance.validate(req, res, next);
          ValidationError.should.have.been.calledWith('tenant-dob', {type: 'age'});
        });
      });
    });
  });
});
