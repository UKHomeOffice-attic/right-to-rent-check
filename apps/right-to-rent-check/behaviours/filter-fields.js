'use strict';

module.exports = superclass => class extends superclass {

  locals(req, res) {
    const locals = super.locals(req, res);
    locals.fields = locals.fields.filter(field => !req.form.options.fields[field.key].dependent);
    return locals;
  }

};
