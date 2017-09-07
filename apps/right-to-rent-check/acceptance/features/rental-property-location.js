'use strict';

const steps = require('../../');

Feature('Given I am at /rental-property-location');

Before((
  I,
  rentalPropertyLocationPage
) => {
  I.visitPage(rentalPropertyLocationPage, steps);
});

Scenario('Then the correct fields are on the page', (
  I
) => {
  I.seeElement('#rental-property-location-england');
  I.seeElement('#rental-property-location-scotland');
  I.seeElement('#rental-property-location-wales');
  I.seeElement('#rental-property-location-ireland');
});

Scenario('When do not check an option and I submit the form then I see an error', (
  I
) => {
  I.submitForm();
  I.seeErrors('#rental-property-location');
});

Scenario('When I check England and submit the form then I see /rental-property-address', (
  I
) => {
  I.checkOption('England');
  I.submitForm();
  I.seeInCurrentUrl('/rental-property-address');
});

Scenario('When I check Scotland and submit the form then I see /check-not-needed-location', (
  I
) => {
  I.checkOption('Scotland');
  I.submitForm();
  I.seeInCurrentUrl('/check-not-needed-location');
});

Scenario('When I check Wales and submit the form then I see /check-not-needed-location', (
  I
) => {
  I.checkOption('Wales');
  I.submitForm();
  I.seeInCurrentUrl('/check-not-needed-location');
});

Scenario('When I check Northern Ireland and submit the form then I see /check-not-needed-location', (
  I
) => {
  I.checkOption('Ireland');
  I.submitForm();
  I.seeInCurrentUrl('/check-not-needed-location');
});
