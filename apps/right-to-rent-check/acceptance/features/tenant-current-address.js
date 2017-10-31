'use strict';

const steps = require('../../');

Feature('Given I am on /tenant-current-address');

Before((
  I,
  tenantCurrentAddressPage
) => {
  I.visitPage(tenantCurrentAddressPage, steps);
});

Scenario('When I submit a valid address Then I am taken to the check confirmed page', (
  I,
  tenantCurrentAddressPage,
  checkConfirmedPage
) => {
  tenantCurrentAddressPage.completeAddress();
  I.seeInCurrentUrl(checkConfirmedPage.url);
});
