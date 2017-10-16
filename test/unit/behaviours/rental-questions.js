'use strict';

const reqres = require('reqres');
const behaviour = require('../../../apps/right-to-rent-check/behaviours/rental-questions');

describe('behaviours/rental-questions', () => {

  class Base {
    locals() {}
  }

  let sessionModel;
  let controller;
  let req;
  let res;

  it('exports a function', () => {
    expect(behaviour).to.be.a('function');
  });

  describe('initialisation', () => {

    it('returns a mixin', () => {
      const Mixed = behaviour(Base);
      expect(new Mixed()).to.be.an.instanceOf(Base);
    });

  });

  describe('locals()', () => {

    const superLocals = {
      foo: 'bar'
    };

    const attrs = {
      'documents-check': 'no',
      'rental-property-location': 'england',
      'rental-property-address': '1 New Street, Town, ABC 123',
      'tenant-in-uk': 'yes',
      'tenancy-start': '2017-7-7',
      'current-property-address': '1 Old Street, Ville, DEF 456'
    };

    let Behaviour;

    beforeEach(() => {
      sessionModel = {
        toJSON: sinon.stub()
      };

      res = reqres.res();
      req = reqres.req({
        sessionModel,
        translate: sinon.stub().returns('question')
      });

      req.translate.withArgs('pages.check-confirmed.table.documents').returns('documents');
      req.translate.withArgs('pages.check-confirmed.table.where').returns('where');
      req.translate.withArgs('pages.check-confirmed.table.address').returns('address');
      req.translate.withArgs('pages.check-confirmed.table.persons').returns('status');
      req.translate.withArgs('pages.check-confirmed.table.when').returns('tenancy-start');
      req.translate.withArgs('pages.check-confirmed.table.uk').returns('uk');
      req.translate.withArgs('pages.check-confirmed.table.current').returns('current');

      sinon.stub(Base.prototype, 'locals').returns(superLocals);
      Behaviour = behaviour(Base);
      controller = new Behaviour();
    });

    afterEach(() => {
      Base.prototype.locals.restore();
    });

    it('always returns questions and answers for documents, where, address, and living-status', () => {

      req.sessionModel.toJSON.returns(attrs);

      expect(controller.locals(req, res))
        .to.have.property('questions')
        .and.include.deep.members([{
          question: 'documents',
          answer: 'no'
        }, {
          question: 'where',
          answer: 'england'
        }, {
          question: 'address',
          answer: '1 New Street, Town, ABC 123'
        }]);
    });

    describe('when the living-status is \'yes\'', () => {

      it('also returns a question and answer for tenancy-start', () => {

        req.sessionModel.toJSON.returns(Object.assign(attrs, {'living-status': 'yes'}));

        expect(controller.locals(req, res))
          .to.have.property('questions')
          .and.deep.equal([{
            question: 'documents',
            answer: 'no'
          }, {
            question: 'where',
            answer: 'england'
          }, {
            question: 'address',
            answer: '1 New Street, Town, ABC 123'
          }, {
            question: 'status',
            answer: 'yes'
          }, {
            question: 'tenancy-start',
            answer: '7-7-2017'
          }]);
      });

      it('does not return a question and answer for tenant-in-uk and current-address', () => {

        req.sessionModel.toJSON.returns(Object.assign(attrs, {'living-status': 'yes'}));

        expect(controller.locals(req, res))
          .to.have.property('questions')
          .and.not.include.deep.members([{
            question: 'uk',
            answer: 'yes'
          }, {
            question: 'current',
            answer: '1 Old Street, Ville, DEF 456'
          }]);
      });

    });

    describe('when the living-status is \'no\'', () => {

      it('also returns a question and answer for tenant-in-uk and current-address', () => {

        req.sessionModel.toJSON.returns(Object.assign(attrs, {'living-status': 'no'}));

        expect(controller.locals(req, res))
          .to.have.property('questions')
          .and.deep.equal([{
            question: 'documents',
            answer: 'no'
          }, {
            question: 'where',
            answer: 'england'
          }, {
            question: 'address',
            answer: '1 New Street, Town, ABC 123'
          }, {
            question: 'status',
            answer: 'no'
          }, {
            question: 'uk',
            answer: 'yes'
          }, {
            question: 'current',
            answer: '1 Old Street, Ville, DEF 456'
          }]);
      });

    });

    it('does not return a question and answer for tenant-in-uk and current-address', () => {

        req.sessionModel.toJSON.returns(Object.assign(attrs, {'living-status': 'no'}));

        expect(controller.locals(req, res))
          .to.have.property('questions')
          .and.not.include.deep.members([{
            question: 'tenancy-start',
            answer: '7-7-2017'
          }]);
      });

  });

});
