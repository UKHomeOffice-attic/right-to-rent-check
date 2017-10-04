'use strict';

Feature('Agent Landlord\'s Name Step');

Before((
  I
) => {
  I.amOnPage('/');
  I.completeToStep('/landlord-name', {
    'documents-check': 'no',
    'rental-property-location': 'england',
    'living-status': 'yes',
    'tenancy-start-day': '1',
    'tenancy-start-month': '1',
    'tenancy-start-year': '2017',
    'representative': 'agent',
    'agent-company': 'abc corp',
    'agent-name': 'abc',
    'agent-email-address': 'abc@abc-corp.com',
    'agent-phone-number': '12345',
    'agent-address': 'CR0 2EU',
  });
});

Scenario('The correct fields are on the page', (
  I,
  landlordNamePage
) => {
  I.seeElements(landlordNamePage.fields.name);
});

Scenario('I see an error if I submit the form without completing', (
  I,
  landlordNamePage
) => {
  I.submitForm();
  I.seeErrors(landlordNamePage.fields.name);
});

Scenario('I am taken to the landlord address page on a valid submission', (
  I,
  landlordNamePage,
  landlordAddressPage
) => {
  I.fillField(landlordNamePage.fields.name, landlordNamePage.content.name);
  I.submitForm();
  I.seeInCurrentUrl(landlordAddressPage.url);
});
