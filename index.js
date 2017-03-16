'use strict';

/* eslint no-process-env: 0*/
const bootstrap = require('hof-bootstrap');

const settings = require('./hof.settings.json');

settings.routes = settings.routes.map(route => require(route));
settings.root = __dirname;
settings.start = false;

if (process.env.MOCK_POSTCODE === 'true') {
  settings.middleware = [require('./mock-postcode')];
}

console.log(settings)

module.exports = bootstrap(settings);
