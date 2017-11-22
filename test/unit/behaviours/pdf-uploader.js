'use strict';

const fs = require('fs');

const reqres = require('hof-util-reqres');

const Behaviour = require('../../../apps/right-to-rent-check/behaviours/pdf-uploader');
const PDFModel = require('../../../apps/right-to-rent-check/models/pdf');
const UploadModel = require('../../../apps/right-to-rent-check/models/upload');

describe('apps/behaviours/pdf-uploader', () => {

  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  describe('initialisation', () => {
    it('returns a mixin', () => {
      class Base {}
      const Mixed = Behaviour(Base);
      expect(new Mixed()).to.be.an.instanceOf(Base);
    });
  });

  describe('process', () => {

    class Base {
      process() {}
      locals() {}
    }

    const uploadResult = {url: 'path/'};
    const pdf = Buffer(100);

    let Mixed;
    let instance;
    let req = reqres.req({
      log: () => {},
      form: {
        options: {
          sections: []
        },
        values: {}
      }
    });
    let html = '<html></html>';
    let res = {
      render: sinon.stub().yields(null, html)
    };

    beforeEach(() => {
      sinon.stub(fs, 'readFile').yieldsAsync(null, 'body { color: red; }');
      sinon.stub(PDFModel.prototype, 'set');
      sinon.stub(PDFModel.prototype, 'save').resolves(pdf);
      sinon.stub(UploadModel.prototype, 'set');
      sinon.stub(UploadModel.prototype, 'save').resolves(uploadResult);
      sinon.stub(Base.prototype, 'process').yields();
      Mixed = Behaviour(Base);
      instance = new Mixed();
    });

    afterEach(() => {
      fs.readFile.restore();
      PDFModel.prototype.set.restore();
      PDFModel.prototype.save.restore();
      UploadModel.prototype.set.restore();
      UploadModel.prototype.save.restore();
      Base.prototype.process.restore();
    });

    it('sets and saves the html template to the PDF model', (done) => {
      instance.process(req, res, (err) => {
        expect(err).not.to.exist;
        expect(PDFModel.prototype.set).to.have.been.calledWith({template: html});
        expect(PDFModel.prototype.save).to.have.been.called;
        done();
      });
    });

    it('passes the result from the PDF model to the Upload model', (done) => {
      instance.process(req, res, (err) => {
        expect(err).not.to.exist;
        expect(UploadModel.prototype.set).to.have.been.calledWith({
          name: 'application_form.pdf',
          data: pdf,
          mimetype: 'application/pdf'
        });
        expect(UploadModel.prototype.save).to.have.been.called;
        done();
      });
    });

    it('sets the result from the Upload model to the to form values on the request', (done) => {
      instance.process(req, res, (err) => {
        expect(err).not.to.exist;
        expect(req.form.values['pdf-upload']).to.equal(uploadResult.url);
        done();
      });
    });

    it('calls super process with the arguments to process', (done) => {
      instance.process(req, res, (err) => {
        expect(err).not.to.exist;
        expect(Base.prototype.process).to.have.been.calledWithExactly(req, res, sinon.match.func);
        done();
      });
    });

    it('passes the error to next if the html can\'t be rendered', (done) => {
      res.render.yields(new Error({code: 'test'}));
      instance.process(req, res, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('passes the error to next if the html can\'t be converted', (done) => {
      PDFModel.prototype.save.rejects(new Error());
      instance.process(req, res, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('passes the error to next if the pdf can\'t be uploaded', (done) => {
      UploadModel.prototype.save.rejects(new Error());
      instance.process(req, res, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

  });

});

