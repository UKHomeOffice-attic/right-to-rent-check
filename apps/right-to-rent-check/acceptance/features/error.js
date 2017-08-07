'use strict';
let Helper = codecept_helper;

Feature('Error page');

Before((
  I
) => {
  I.amOnPage('/');
});

Scenario.only('Session timeout page, start again button sends user to start page', (
  I
) => {
  I.completeToStep('/person-in-property');
  I.getCookie();
  I.refreshPage();
  I.see('Sorry');
});
