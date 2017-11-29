'use strict';

/* eslint no-process-env: 0*/
const hof = require('hof');
const settings = require('./hof.settings.json');
const config = require('./config');

settings.routes = settings.routes.map(route => require(route));
settings.root = __dirname;
settings.start = false;
settings.redis = config.redis;
settings.getCookies = settings.getTerms = false;

if (process.env.NODE_ENV !== 'production') {
  settings.middleware = [require('./mock-apis')];
}

module.exports = hof(settings);
