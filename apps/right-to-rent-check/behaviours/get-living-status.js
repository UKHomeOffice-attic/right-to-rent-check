'use strict';

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);
    if (locals.tenants.length) {
      if (req.sessionModel.get('living-status') === 'yes') {
        locals.livingStatusId = 'yes-living-status';
        locals.livingStatusHeader = req.translate('pages.request-another-tenant.yes-living-status.header');
        locals.livingStatusIntro = req.translate('pages.request-another-tenant.yes-living-status.intro');
        return locals;
      }
      locals.livingStatusId = 'no-living-status';
      locals.firstTenant = locals.tenants[0]['tenant-name'];
      locals.livingStatusHeader = req.translate('pages.request-another-tenant.no-living-status.header');
      locals.livingStatusIntro = req.translate('pages.request-another-tenant.no-living-status.intro');
    }
    return locals;
  }
};
