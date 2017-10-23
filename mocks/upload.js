/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

const router = require('express').Router();

router.post('/', (req, res) => {
  res.json({'url': `http://s3.com/foo/${Math.random()}`});
});

module.exports = router;
