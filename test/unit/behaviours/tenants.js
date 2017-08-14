'use strict';

const uuidFake = '1234-abcd-5678-efgh';
const reqres = require('reqres');
const proxyquire = require('proxyquire');
const Behaviour = proxyquire('../../../apps/right-to-rent-check/behaviours/tenants', {
  'uuid/v4': sinon.stub().returns(uuidFake)
});

describe('behaviours/tenants', () => {

  class Base {
    locals() {}
    render() {}
    getValues() {}
    saveValues() {}
    emit() {}
  }

  let values;
  let tenants;
  let fields;
  let sessionModel;
  let controller;
  let Tenants;
  let req;
  let res;

  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  describe('initialisation', () => {

    it('returns a mixin', () => {
      fields = ['tenant-name'];
      const Mixed = Behaviour(fields)(Base);
      expect(new Mixed()).to.be.an.instanceOf(Base);
    });

  });

  describe('locals', () => {

    const superLocals = {
      foo: 'bar'
    };

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub()
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      sinon.stub(Base.prototype, 'locals').returns(superLocals);
      Tenants = Behaviour()(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.locals.restore();
    });

    it('returns locals extended from super with tenants', () => {

      tenants = [{
        'tenant-name': 'john smith',
        'tenant-age': '24'
      }];

      req.sessionModel.get.withArgs('tenants').returns(tenants);

      expect(controller.locals(req, res)).to.deep.equal(Object.assign(superLocals, {
        tenants: tenants
      }));

    });
  });

  describe('render', () => {

    let callback;
    const redirectTo = 'foo/';

    beforeEach(() => {
      sessionModel = {
        get: sinon.stub().withArgs('redirectTo').returns(redirectTo),
        unset: sinon.stub()
      };
      const redirectStub = sinon.stub();
      res = reqres.res({redirect: redirectStub});
      req = reqres.req({sessionModel});
      callback = sinon.stub();
      sinon.stub(Base.prototype, 'render');
      sinon.stub(Base.prototype, 'emit');
      Tenants = Behaviour()(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.render.restore();
      Base.prototype.emit.restore();
    });

    it('calls super render by default', () => {
      sessionModel.get.withArgs('redirectTo').returns(null);
      controller.render(req, res, callback);
      expect(Base.prototype.render).to.have.been.calledWithExactly(req, res, callback);

    });

    it('unsets `redirectTo` from the session', () => {
      controller.render(req, res, callback);
      expect(req.sessionModel.unset).to.have.been.calledWith('redirectTo');
    });

    it('emits `complete` if there is a redirectTo', () => {
      controller.render(req, res, callback);
      expect(controller.emit).to.have.been.calledWith('complete');
    });

    it('redirects to redirectTo path if there is a redirectTo', () => {
      controller.render(req, res, callback);
      expect(res.redirect).to.have.been.calledWith(redirectTo);

    });

  });

  describe('saveValues', () => {

    beforeEach(() => {
      sessionModel = {
        unset: sinon.stub()
      };
      fields = [
        'tenant-name',
        'tenant-age',
        'tenant-uuid'
      ];
      res = reqres.res();
      req = reqres.req({sessionModel});
      sinon.stub(Base.prototype, 'saveValues');
      Tenants = Behaviour(fields)(Base);
      controller = new Tenants();
    });

    afterEach(() => {
      Base.prototype.saveValues.restore();
    });

    it('unsets all fields and the tenant-uuid from the session', (done) => {
      controller.saveValues(req, res, () => {
        expect(sessionModel.unset)
          .to.have.been.calledWithExactly(fields.concat('tenant-uuid', 'redirectTo'));
        done();
      });
    });

  });

  describe('getValues', () => {

    let superGetValues;
    let valuesOut;

    const steps = {
      '/where': {
        fields: [
          'tenant-country'
        ]
      },
      '/what':
       { fields:
          [
            'tenant-name',
            'tenant-age'
          ]
       }
    };

    // the step where the field tenant-age is
    const redirectTo = '/what';

    beforeEach(() => {
      fields = [
        'tenant-name',
        'tenant-age'
      ];
      sessionModel = {
        get: sinon.stub(),
        set: sinon.stub(),
        toJSON: sinon.stub()
      };
      res = reqres.res();
      req = reqres.req({sessionModel});
      superGetValues = sinon.stub(Base.prototype, 'getValues');
      Tenants = Behaviour(fields)(Base);
      controller = new Tenants();
      controller.options = {};
      controller.options.steps = steps;
    });

    afterEach(() => {
      Base.prototype.getValues.restore();
    });

    describe('Adding a tenant', () => {

      it('adds a new tenant from the values with a uuid to the list of tenants', (done) => {

        // current values
        values = {
          'tenant-name': 'john smith',
          'tenant-age': '24'
        };

        superGetValues.yields(null, values);

        // expected
        tenants = [{
          'tenant-name': 'john smith',
          'tenant-age': '24',
          'tenant-uuid': uuidFake,
          'edit': false
        }];

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0].tenants).to.deep.equal(tenants);
          done();
        });

      });

      it('replaces the current values with the new tenant', (done) => {

        // current values
        values = {
          'tenant-name': 'john smith',
          'tenant-age': '24'
        };

        superGetValues.yields(null, values);

        // expected
        valuesOut = {
          'tenant-name': 'john smith',
          'tenant-age': '24',
          'tenant-uuid': uuidFake,
          tenants: [{
            'tenant-name': 'john smith',
            'tenant-age': '24',
            'tenant-uuid': uuidFake,
            'edit': false
          }]
        };

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set).to.have.been.calledWith(valuesOut);
          done();
        });

      });

      it('only adds the configured fields to a tenant', (done) => {

        // current values
        values = {
          'tenant-name': 'john smith',
          'tenant-age': '24',
          'foo': 'bar'
        };

        superGetValues.yields(null, values);

        // expected
        valuesOut = {
          'tenant-name': 'john smith',
          'tenant-age': '24',
          'tenant-uuid': uuidFake,
          'foo': 'bar',
          tenants: [{
            'tenant-name': 'john smith',
            'tenant-age': '24',
            'tenant-uuid': uuidFake,
            'edit': false
          }]
        };

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0]).to.have.property('foo').and.equal('bar');
          expect(req.sessionModel.set.args[0][0].tenants[0]).to.not.have.property('foo');
          expect(req.sessionModel.set).to.have.been.calledWith(valuesOut);
          done();
        });

      });

      it('adds a new tenant next to an existing tenant', (done) => {

        // previously saved
        req.sessionModel.get.withArgs('tenants').returns([{
          'tenant-name': 'John Smythe',
          'tenant-age': '42',
          'tenant-uuid': '123456789'
        }]);

        // current values
        values = {
          'tenant-name': 'John Smith',
          'tenant-age': '24'
        };

        superGetValues.yields(null, values);

        // expected
        valuesOut = {
          'tenant-name': 'John Smith',
          'tenant-age': '24',
          'tenant-uuid': uuidFake,
          tenants: [{
            'tenant-name': 'John Smythe',
            'tenant-age': '42',
            'tenant-uuid': '123456789'
          }, {
            'tenant-name': 'John Smith',
            'tenant-age': '24',
            'tenant-uuid': uuidFake,
            'edit': false
          }]
        };

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set).to.have.been.calledWith(valuesOut);
          done();
        });

      });

    });

    describe('Editting a tenant detail', () => {

      beforeEach(() => {

        // previously saved to the session model
        req.sessionModel.get.withArgs('tenants').returns([{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890'
        }, {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        }]);

        // edit link clicked
        req.params = {
          action: 'edit',
          id: '1234567890'
        };

        req.query = {
          field: 'tenant-age'
        };

        // expected tenants
        tenants = [{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890',
          'edit': true
        }, {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        }];

        values = {
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890',
          tenants: tenants
        };

      });

      it('sets `edit` flag on tenants to be editted', (done) => {

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0].tenants[0])
            .to.have.property('edit').and.equal(true);
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

      it('sets the tenant to be editted to the tenant to be viewed', (done) => {
        // before we redirect we must take the fields from the
        // tenant we intend to edit and set them to the
        // current tenant valeus on the session

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0]['tenant-uuid'])
            .to.equal(tenants[0]['tenant-uuid']);
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

      it('redirects to the step where the edittable field is located', (done) => {

        req.query = {
          field: 'tenant-age'
        };

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0])
            .to.have.property('redirectTo')
            .and.equal(`${redirectTo}#tenant-age`);
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

    });

    describe('Deleting a tenant', () => {

      beforeEach(() => {

        // previously saved to the session model
        req.sessionModel.get.withArgs('tenants').returns([{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890'
        }, {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        }]);

        // edit link clicked
        req.params = {
          action: 'delete',
          id: '0987654321'
        };

        // expected tenants
        tenants = [{
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        }];

        values = {
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890',
          tenants: tenants
        };

      });

      it('removes the tenant from the tenants', (done) => {

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0].tenants).to.have.length(1);
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

    });

    describe('Deleting the last tenant', () => {

      beforeEach(() => {

        // previously saved to the session model
        req.sessionModel.get.withArgs('tenants').returns([{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890'
        }]);

        // edit link clicked
        req.params = {
          action: 'delete',
          id: '1234567890'
        };

        // expected tenants
        tenants = [];

        values = {
          tenants: tenants
        };

      });

      it('removes the tenant from the tenants and the values', (done) => {

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0].tenants).to.have.length(0);
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

      it('redirects to the tenant-details page if the last tenant is deleted', (done) => {

        superGetValues.returns(req, res).yields(null, values);

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set.args[0][0])
            .to.have.property('redirectTo')
            .and.equal('/tenant-details');
          expect(req.sessionModel.set).to.have.been.calledWith(values);
          done();
        });

      });

    });

    describe('After editting a tenant', () => {

      beforeEach(() => {
        // previously saved
        req.sessionModel.get.withArgs('tenants').returns([{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890'
        }, {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321',
          'edit': true
        }]);

        values = {
          'tenant-name': 'Angel Ragwort',
          'tenant-age': '39'
        };

        superGetValues.returns(req, res).yields(null, values);

        // expected
        valuesOut = {
          'tenant-name': 'Angel Ragwort',
          'tenant-age': '39',
          'tenant-uuid': '0987654321',
          tenants: [{
            'tenant-name': 'Karen Worth',
            'tenant-age': '42',
            'tenant-uuid': '1234567890'
          }, {
            'tenant-name': 'Angel Ragwort',
            'tenant-age': '39',
            'tenant-uuid': '0987654321',
            'edit': false
          }]
        };

      });

      it('replaces the tenant to be editted with the current values', (done) => {

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set).to.have.been.calledWith(valuesOut);
          done();
        });

      });

    });

    describe('Reloading the tenant-details', () => {

      beforeEach(() => {

        tenants = [{
          'tenant-name': 'Karen Worth',
          'tenant-age': '42',
          'tenant-uuid': '1234567890'
        }, {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        }];

        // previously saved
        req.sessionModel.get.withArgs('tenants').returns(tenants);

        values = {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321'
        };

        superGetValues.returns(req, res).yields(null, values);

        // expected
        valuesOut = {
          'tenant-name': 'Angela Ragwort',
          'tenant-age': '37',
          'tenant-uuid': '0987654321',
          tenants: tenants
        };

      });

      it('neither the values nor the session model change', (done) => {

        controller.getValues(req, res, (err) => {
          expect(err).not.to.exist;
          expect(req.sessionModel.set).to.have.not.been.called;
          done();
        });

      });

    });

  });

});
