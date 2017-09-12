'use strict';

const steps = require('../../');

Feature('Given I am on /check-not-needed-date');

Scenario('When I click on the back to guidance link I am taken to https://www.gov.uk/check-tenant-right-to-rent-documents', (
  I,
  checkNotNeededDatePage
) => {
  I.visitPage(checkNotNeededDatePage, steps);
  I.click('#content a');
  I.seeCurrentUrlEquals('https://www.gov.uk/check-tenant-right-to-rent-documents');
});
