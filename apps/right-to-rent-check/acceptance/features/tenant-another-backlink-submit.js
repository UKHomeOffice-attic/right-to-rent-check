'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Add Another Page Back Link and Submit');

Before((
  I,
  tenantAddAnotherPage
) => {
  I.visitPage(tenantAddAnotherPage, steps);
  I.click(tenantAddAnotherPage.selectors.backLink);
});

Scenario('I see the same Tenant Details on the tenant-add-another page', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(tenantAddAnotherPage.url);
  tenantAddAnotherPage.seeOneElement('details-table');
});

Scenario('I see the Tenant Details change on the tenant-add-another page if I edit a field', (
  I,
  tenantAddAnotherPage,
  tenantAdditionalDetailsPage
) => {
  I.click('#tenant-additional-details-brp-number');
  I.fillField('#tenant-brp-number', 'foobar');
  I.submitForm();
  I.see('foobar');
});
