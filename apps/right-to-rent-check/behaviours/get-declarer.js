'use strict';

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    if (req.sessionModel.get('representative') === 'landlord') {
      locals.declarer = req.translate('pages.declaration.landlord');
      locals.declarerId = 'landlord';
      locals.declarerEmail = req.sessionModel.get('landlord-email-address');
      return locals;
    }
    locals.declarer = req.translate('pages.declaration.agent');
    locals.declarerId = 'agent';
    locals.declarerEmail = req.sessionModel.get('agent-email-address');
    return locals;
  }
};
