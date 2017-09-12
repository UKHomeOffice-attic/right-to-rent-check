'use strict';

const steps = require('../../');

Feature('Given I am on /check-not-needed-date');

Before((
  I,
  checkNotNeededDatePage
) => {
  I.visitPage(checkNotNeededDatePage, steps);
});

Scenario('When I click on the back to guidance link I am taken to https://www.gov.uk/check-tenant-right-to-rent-documents', (
  I
) => {
  I.click('#content a');
  I.seeInCurrentUrl('www.gov.uk/check-tenant-right-to-rent-documents');
});
