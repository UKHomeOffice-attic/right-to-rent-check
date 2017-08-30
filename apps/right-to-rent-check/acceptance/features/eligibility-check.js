'use strict';

const steps = require('../../');

Feature('Given I am on the /eligibility-check Page');

Before((
  I,
  eligibilityCheckPage
) => {
  I.visitPage(eligibilityCheckPage, steps);
});

Scenario('When I click continue Then I am taken to /documents-check page', (
  I,
  documentCheckPage
) => {
  I.submitForm();
  I.seeInCurrentUrl(documentCheckPage.url);
});
