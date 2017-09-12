'use strict';

const steps = require('../../');

Feature('Given I am on /declaration page');

Scenario('When I submit the form I go to /confirmation', (
  I,
  declarationPage
) => {
  I.visitPage(declarationPage, steps);
  I.submitForm();
  I.seeInCurrentUrl('confirmation');
});
