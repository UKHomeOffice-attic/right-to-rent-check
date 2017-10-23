'use strict';

const DynamicTitle = require('../../../apps/right-to-rent-check/behaviours/dynamic-title');

class Base {
  getTitle(route, lookup) {
    return lookup();
  }
}

describe('Dynamic Title', () => {

  let route;
  let lookup;
  let fields;
  let locals;

  beforeEach(() => {
    route = 'route';
    lookup = sinon.stub();
    fields = {};
    locals = {
      values: {}
    };
    sinon.stub(Base.prototype, 'getTitle').returns('Default title');

  });

  afterEach(() => {
    Base.prototype.getTitle.restore();
  });

  describe('getTitle', () => {

    it('returns the default title if no key is provided', () => {
      const Controller = DynamicTitle()(Base);
      const instance = new Controller();
      instance.getTitle(route, lookup, fields, locals).should.equal('Default title');
    });

    it('returns the default title if a key is provided, but no value for the key exists', () => {
      const Controller = DynamicTitle('type')(Base);
      const instance = new Controller();
      instance.getTitle(route, lookup, fields, locals).should.equal('Default title');
    });

    it('looks up a header for the step suffixed with the relevant field value if it is defined', () => {
      const Controller = DynamicTitle('type')(Base);
      const instance = new Controller();
      locals.values.type = 'test';
      instance.getTitle(route, lookup, fields, locals);
      lookup.should.have.been.calledWith('pages.route.header.test');
    });

    it('returns the custom title if it is found', () => {
      const Controller = DynamicTitle('type')(Base);
      const instance = new Controller();
      locals.values.type = 'test';
      lookup.withArgs('pages.route.header.test').returns('Custom title');
      instance.getTitle(route, lookup, fields, locals).should.equal('Custom title');
    });

    it('returns the default title if no custom title is found', () => {
      const Controller = DynamicTitle('type')(Base);
      const instance = new Controller();
      locals.values.type = 'test';
      instance.getTitle(route, lookup, fields, locals).should.equal('Default title');
    });

  });

});
