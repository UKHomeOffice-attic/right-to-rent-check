'use strict';

const _ = require('lodash');
const steps = require('../../');

Feature('Tenant Add Another Page');

Before((
  I,
  tenantAddAnotherPage
) => {
  I.visitPage(tenantAddAnotherPage, steps);
});

Scenario('The correct fields are on the page', (
  I,
  tenantAddAnotherPage
) => {
  I.seeElements(_.values(tenantAddAnotherPage.fields));
});

Scenario('I see one tenant details table on the page', (
  I,
  tenantAddAnotherPage
) => {
  I.seeNumberOfElements('.tenant-details', 1);
});

Scenario('I see a change button next to each tenant detail', (
  I,
  tenantAddAnotherPage
) => {
  I.seeElements('#content form table > tbody > tr > td > a');
  I.seeNumberOfElements('.tenant-details', 1);
});

Scenario('I see an error if I submit without selecting an option', (
  I,
  tenantAddAnotherPage
) => {
  I.submitForm();
  I.seeErrors(tenantAddAnotherPage.fields.group);
});

Scenario('I am taken to the tenant-details page if I select `yes`', (
  I,
  tenantAddAnotherPage,
  tenantDetailsPage
) => {
  I.checkOption(tenantAddAnotherPage.fields.yes);
  I.submitForm();
  I.seeInCurrentUrl(tenantDetailsPage.url);
});

Scenario('I am taken to the landlord-agent page if I select `no`', (
  I,
  tenantAddAnotherPage,
  landlordAgentPage
) => {
  I.checkOption(tenantAddAnotherPage.fields.no);
  I.submitForm();
  I.seeInCurrentUrl(landlordAgentPage.url);
});
