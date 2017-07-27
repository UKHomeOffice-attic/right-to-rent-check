'use strict';

global.chai = require('chai')
  .use(require('sinon-chai'));
global.expect = chai.expect;
global.sinon = require('sinon');
process.setMaxListeners(0);
process.stdout.setMaxListeners(0);
