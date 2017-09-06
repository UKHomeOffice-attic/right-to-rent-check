'use strict';

const reqres = require('reqres');
const Behaviour = require('../../../apps/right-to-rent-check/behaviours/get-declarer');

describe('apps/behaviours/get-declarer', () => {
  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  class Base {
    locals() {}
  }
  let req;
  let res;
  let sessionModel;
  let GetDeclarer;
  let instance;
  let translate;

  const superLocals = {
    foo: 'bar'
  };

  beforeEach(() => {
    sessionModel = {
      get: sinon.stub()
    };
    translate = sinon.stub();
    res = reqres.res();
    req = reqres.req({sessionModel, translate});
    sinon.stub(Base.prototype, 'locals').returns(superLocals);
    GetDeclarer = Behaviour(Base);
    instance = new GetDeclarer();
  });

  afterEach(() => {
    Base.prototype.locals.restore();
  });

  describe('locals', () => {
    it('returns extended locals from super with the declarer when the representative is the landlord ', () => {
      const declarer = {
        declarer: 'landlordDeclarer',
        declarerId: 'landlord',
        declarerEmail: 'landlord@aol.com'
      };
      const expected = {
        foo: 'bar',
        declarer: 'landlordDeclarer',
        declarerId: 'landlord',
        declarerEmail: 'landlord@aol.com'
      };

      req.translate.withArgs('pages.declaration.landlord').returns(declarer.declarer);
      req.sessionModel.get.withArgs('representative').returns(declarer.declarerId);
      req.sessionModel.get.withArgs('landlord-email-address').returns(declarer.declarerEmail);

      const result = instance.locals(req, res);
      result.should.deep.equal(expected);
    });
    it('returns extended locals from super with the declarer when the representative is the agent', () => {
      const declarer = {
        declarer: 'agentDeclarer',
        declarerId: 'agent',
        declarerEmail: 'agent@aol.com'
      };
      const expected = {
        foo: 'bar',
        declarer: 'agentDeclarer',
        declarerId: 'agent',
        declarerEmail: 'agent@aol.com'
      };

      req.sessionModel.get.withArgs('representative').returns(declarer.declarerId);
      req.translate.withArgs('pages.declaration.agent').returns(declarer.declarer);
      req.sessionModel.get.withArgs('agent-email-address').returns(declarer.declarerEmail);

      const result = instance.locals(req, res);
      result.should.deep.equal(expected);
    });
  });
});
