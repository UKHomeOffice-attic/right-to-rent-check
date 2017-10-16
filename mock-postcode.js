/* eslint implicit-dependencies/no-implicit: [2, {dev:true}] */

'use strict';
const router = require('express').Router();

module.exports = router.use('/api/postcode-test/:action?/:postcode?', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  const action = req.params.action;
  const postcode = decodeURIComponent(req.params.postcode);
  if (action === 'addresses') {
    if (req.query.postcode === 'CR0 2EU') {
      res.send(JSON.stringify([{
      // eslint-disable-next-line camelcase
        formatted_address: '49 Sydenham Road\nCroydon\nCR0 2EU', postcode: 'CR0 2EU'
      }]));
    } else if (req.query.postcode === 'B1 2EA') {
      res.send(JSON.stringify([{
      // eslint-disable-next-line camelcase
        formatted_address: '1 Broad Street\nBirmingham\nWest Midlands\nB1 2EA', postcode: 'B1 2EA'
      }]));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify([]));
    }
  } else if (action === 'postcodes') {
    if (postcode === 'CR0 2EU') {
      res.send(JSON.stringify({
        country: {
          name: 'England'
        }
      }));
    } else if (postcode === 'CH5 1AB') {
      res.send(JSON.stringify({
        country: {
          name: 'Wales'
        }
      }));
    } else {
      res.send(JSON.stringify({}));
    }
  }
});
