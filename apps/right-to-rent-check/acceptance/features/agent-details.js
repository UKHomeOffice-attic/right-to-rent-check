'use strict';

const steps = require('../../');

Feature('Agent Details Page');

Before((
  I,
  agentDetailsPage
) => {
  I.visitPage(agentDetailsPage, steps);
});

Scenario('I see the correct fields on the page', (
  I,
  agentDetailsPage
) => {
  I.seeElements([
    agentDetailsPage.fields.company,
    agentDetailsPage.fields.name,
    agentDetailsPage.fields.email,
    agentDetailsPage.fields.phone
  ]);
});

Scenario('I see errors if I submit the form without completing', (
  I,
  agentDetailsPage
) => {
  I.submitForm();
  I.seeErrors([
    agentDetailsPage.fields.company,
    agentDetailsPage.fields.name,
    agentDetailsPage.fields.email,
    agentDetailsPage.fields.phone
  ]);
});

Scenario('I see an error if I enter an invalid email address', (
  I,
  agentDetailsPage
) => {
  I.fillField(agentDetailsPage.fields.email, agentDetailsPage.content.invalidEmail);
  I.submitForm();
  I.seeErrors(agentDetailsPage.fields.email);
});

Scenario('I am taken to /agent-address on a valid submission', (
  I,
  agentDetailsPage,
  agentAddressPage
) => {
  I.fillField(agentDetailsPage.fields.company, agentDetailsPage.content.company);
  I.fillField(agentDetailsPage.fields.name, agentDetailsPage.content.name);
  I.fillField(agentDetailsPage.fields.email, agentDetailsPage.content.email);
  I.fillField(agentDetailsPage.fields.phone, agentDetailsPage.content.phone);
  I.submitForm();
  I.seeInCurrentUrl(agentAddressPage.url);
});
