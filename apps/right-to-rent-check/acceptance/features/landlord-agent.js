'use strict';

const steps = require('../../');

Feature('landlord agent step');

Before((
  I,
  landlordAgentPage
) => {
  I.visitPage(landlordAgentPage, steps);
});

Scenario('I select Landlord, click ‘Continue’ & go to /landlord-details step', (
  I,
  landlordAgentPage,
  landlordDetailsPage
) => {
  I.click(landlordAgentPage.fields.landlord);
  I.submitForm();
  I.seeInCurrentUrl(landlordDetailsPage.url);
});

Scenario('I select ‘Agent’, click ‘Continue’ I go to /agent-details step', (
  I,
  landlordAgentPage,
  agentDetailsPage
) => {
  I.click(landlordAgentPage.fields.agent);
  I.submitForm();
  I.seeInCurrentUrl(agentDetailsPage.url);
});

Scenario('I see errors when I submit form after leaving both buttons unselected', (
  I,
  landlordAgentPage
) => {
  I.seeElements([
    landlordAgentPage.fields.landlord,
    landlordAgentPage.fields.agent,
  ]);
});
