'use strict';

const steps = require('../../');

Feature('Given my session has expired');

Before((
  I,
  tenancyStartPage
) => {
  I.visitPage(tenancyStartPage, steps);
  I.clearCookie('hod.sid');
  I.refreshPage();
});

Scenario('When I click the start button Then I am redirected to /start', (
  I
) => {
  I.see('Start again');
  I.click('a.button');
  I.seeInCurrentUrl('/eligibility-check');
});
