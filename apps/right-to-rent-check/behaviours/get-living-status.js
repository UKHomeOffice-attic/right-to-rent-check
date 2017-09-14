'use strict';

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    if (req.sessionModel.get('living-status') === 'yes') {
      locals.livingStatusHeader = req.translate('pages.request-another-tenant.yes-living-status.header');
      locals.livingStatusIntro = req.translate('pages.request-another-tenant.yes-living-status.intro');
      return locals;
    }
    locals.firstTenant = locals.tenants[0]['tenant-name'];
    locals.livingStatusHeader = req.translate('pages.request-another-tenant.no-living-status.header');
    locals.livingStatusIntro = req.translate('pages.request-another-tenant.no-living-status.intro');
    return locals;
  }
};
