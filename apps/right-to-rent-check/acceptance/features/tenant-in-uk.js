'use strict';

const steps = require('../../');

Feature('Given I am on the /tenant-in-uk step');

Before((
  I,
  tenantInUkPage
) => {
  I.visitPage(tenantInUkPage, steps);
});

Scenario('When the page loads Then the correct fields are on the page', (
  I
) => {
  I.seeElements(['#tenant-in-uk-yes', '#tenant-in-uk-yes']);
});

Scenario('When I submit an empty form then I see an error for each field', (
  I
) => {
  I.submitForm();
  I.seeErrors('#tenant-in-uk');
});

Scenario('When I select Yes And submit the form Then I am taken to /tenant-current-address page', (
  I,
  tenantCurrentAddressPage
) => {
  I.click('#tenant-in-uk-yes');
  I.submitForm();
  I.seeInCurrentUrl(tenantCurrentAddressPage.url);
});

Scenario('When I select No And submit the form Then I am taken to the /check-not-needed-uk page', (
  I,
  checkNotNeededUkPage
) => {
  I.click('#tenant-in-uk-no');
  I.submitForm();
  I.seeInCurrentUrl(checkNotNeededUkPage.url);
});
