'use strict';

const steps = require('../../../');
const config = require('../../../../../config');

Feature('Given I am on the Manual step of the Landlord Address page');

Before((
  I,
  landlordAddressPage
) => {
  I.visitPage(landlordAddressPage, steps);
  I.click("a[href='?step=manual']");
});

Scenario('When the Manual step loads then the textarea element is visible', (
  I
) => {
  I.seeElements('#landlord-address');
});

Scenario('When the Manual step loads then the Change postcode link is not visible', (
  I
) => {
  I.dontSee('.change-postcode');
});

Scenario('When the Manual step loads then the postcode I entered is not visible', (
  I
) => {
  I.dontSee('span.postcode');
});

Scenario('When the Manual step loads then the info-message is not visible', (
  I
) => {
  I.dontSee('.info-message');
});
