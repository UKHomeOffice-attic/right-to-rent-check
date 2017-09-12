'use strict';

const steps = require('../../');

Feature('Given I am at /check-not-needed-location');

Before((
  I,
  checkNotNeededLocationPage
) => {
  I.visitPage(checkNotNeededLocationPage, steps);
});

Scenario('When the page loads Then the correct fields are on the page', (
  I
) => {
  I.seeElement('h1');
  I.seeElement('p');
  I.seeElement('a#guidance-link');
});

Scenario('When I click the link Then I see https://www.gov.uk/check-tenant-right-to-rent-documents', (
  I
) => {
  I.click('a#guidance-link');
  I.seeInCurrentUrl('https://www.gov.uk/check-tenant-right-to-rent-documents');
});
