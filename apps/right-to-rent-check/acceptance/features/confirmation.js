'use strict';

const steps = require('../../');

Feature('Given I am on /check-confirmed');

Before((
  I,
  confirmationPage
) => {
  I.visitPage(confirmationPage, steps);
});

Scenario('When I click on the `Ask the Home Office to make another right to rent check`, I am taken to /eligibility-check', (
  I
) => {
  I.click('Ask the Home Office to make another right to rent check', '#content');
  I.seeInCurrentUrl('/eligibility-check');
});

Scenario('When I click on the `right to rent guidance`, I am taken to www.gov.uk/check-tenant-right-to-rent-documents', (
  I
) => {
  I.click('right to rent guidance', '#content');
  I.seeCurrentUrlEquals('https://www.gov.uk/check-tenant-right-to-rent-documents');
});

Scenario('When I click on the `right to rent guidance`, I am taken to www.gov.uk/check-tenant-right-to-rent-documents', (
  I
) => {
  I.click('Tell us what you think of this form', '#content');
  I.seeCurrentUrlEquals('https://eforms.homeoffice.gov.uk/outreach/Feedback.ofml?FormName=right_to_rent');
});
