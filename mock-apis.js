/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

const config = require('./config');
const router = require('express').Router();

router.use(config.postcode.mock, require('./mocks/postcode'));
router.use(config.upload.mock, require('./mocks/upload'));
router.use(config.pdf.mock, require('./mocks/pdf'));

module.exports = router;
