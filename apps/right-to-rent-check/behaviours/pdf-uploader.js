'use strict';

const PDFModel = require('../models/pdf');
const UploadModel = require('../models/upload');

module.exports = superclass => class extends superclass {

  process(req, res, next) {
    this.renderHTML(req, res)
      .then(html => this.createPDF(html))
      .then(buffer =>
        this.uploadFile({
          name: 'application_form.pdf',
          data: buffer,
          mimetype: 'application/pdf'
        })
      )
      .then(result => {
        req.form.values['pdf-upload'] = result.url;
      })
      .then(() => super.process(req, res, next), next)
      .catch(err => next(err));
  }

  renderHTML(req, res) {
    return new Promise((resolve, reject) => {
      const locals = Object.assign({}, this.locals(req, res), {
        title: 'Right to Rent Application'
      });
      res.render('pdf.html', locals, (err, html) => {
        if (err) {
          return reject(err);
        }
        resolve(html);
      });
    });
  }

  uploadFile(file) {
    const model = new UploadModel();
    model.set(file);
    return model.save();
  }

  createPDF(template) {
    const model = new PDFModel();
    model.set({template});
    return model.save();
  }

};
