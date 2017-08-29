'use strict';

const steps = require('../../');

Feature('Start Page');

Before((
  I,
  eligibilityCheckPage
) => {
  I.visitPage(eligibilityCheckPage, steps);
});

Scenario('When I click continue Then I am taken to /document-check page', (
  I,
  documentCheckPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(documentCheckPage.url);
});
