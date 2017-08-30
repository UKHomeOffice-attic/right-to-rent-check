'use strict';

const steps = require('../../');

Feature('Given I am on /documents-check-yourself');

Before((
  I,
  documentCheckYourselfPage
) => {
  I.visitPage(documentCheckYourselfPage, steps);
});

Scenario('When I click on the back to guidance link I am taken to https://www.gov.uk/check-tenant-right-to-rent-documents', (
  I
) => {
  I.click('#content a');
  I.seeInCurrentUrl('www.gov.uk/check-tenant-right-to-rent-documents');
});
