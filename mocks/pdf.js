/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */
'use strict';

const router = require('express').Router();

router.post('/', (req, res) => {
  const buf = Buffer.alloc(4);
  buf[0] = 37;
  buf[1] = 80;
  buf[2] = 68;
  buf[3] = 70;
  res.status(201).send(buf);
});

module.exports = router;
