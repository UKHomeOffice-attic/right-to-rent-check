'use strict';
let Helper = codecept_helper;

Feature('Error page');

Before((
  I
) => {
  I.amOnPage('/');
})

Scenario.only('Session timeout page, start again button sends user to start page', (
  I
) => {
  I.completeToStep('/check-you-can-use');
  I.clearCookie();
  I.amOnPage('/check-you-can-use');
});
