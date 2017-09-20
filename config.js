'use strict';

/* eslint no-process-env: 0 */
module.exports = {
  env: process.env.NODE_ENV,
  postcode: {
    hostname: process.env.MOCK_POSTCODE === 'true' ?
      `http://${process.env.LISTEN_HOST || '0.0.0.0'}:${process.env.PORT || 8080}/api/postcode-test` :
      'https://postcodeinfo.service.justice.gov.uk'
  },
  mocks: {
    postcode: 'CR0 2EU',
    address: '49 Sydenham Road, Croydon, CR0 2EU'
  }
};
