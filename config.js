'use strict';

/* eslint no-process-env: 0 */
const env = process.env.NODE_ENV || 'production';
const localhost = () => `${process.env.LISTEN_HOST || '0.0.0.0'}:${process.env.PORT || 8080}`;

module.exports = {
  postcode: {
    mock: '/api/postcode-test',
    hostname: env !== 'production' ?
      `http://${localhost()}/api/postcode-test` :
      'https://postcodeinfo.service.justice.gov.uk',
    stub: {
      postcode: 'CR0 2EU',
      address: '49 Sydenham Road, Croydon, CR0 2EU'
    },
    pilot: [
      'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8',
      'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16',
      'B17', 'B18', 'B19', 'B20', 'B21', 'B23', 'B24', 'B25',
      'B26', 'B27', 'B28', 'B29', 'B30', 'B31', 'B32', 'B33',
      'B34', 'B35', 'B38', 'B42', 'B43', 'B44', 'B45', 'B62',
      'B63', 'B72', 'B73', 'B74', 'B75', 'B76', 'DY1', 'DY2',
      'DY3', 'DY4', 'DY5', 'DY8', 'DY9', 'WS1', 'WS2', 'WS3',
      'WS4', 'WS5', 'WS8', 'WS9', 'WS10', 'WV1', 'WV2', 'WV3',
      'WV4', 'WV6', 'WV8', 'WV9', 'WV10', 'WV11', 'WV12', 'WV13',
      'WV14'
    ]
  },
  redis: {
    password: process.env.REDIS_PASSWORD
  },
  keycloak: {
    token: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_SECRET
  },
  email: {
    from: process.env.FROM_ADDRESS || '',
    transport: process.env.EMAIL_TRANSPORT || 'ses',
    transportOptions: {
      accessKeyId: process.env.HOF_SES_USER || process.env.AWS_USER || '',
      secretAccessKey: process.env.HOF_SES_PASSWORD || process.env.AWS_PASSWORD || ''
    }
  },
  pdf: {
    mock: '/api/pdf-converter',
    hostname: env !== 'production' ?
      `http://${localhost()}/api/pdf-converter` :
      process.env.PDF_CONVERTER_URL,
  },
  upload: {
    maxfilesize: '100mb',
    mock: '/api/file-upload',
    hostname: env !== 'production' ?
      `http://${localhost()}/api/file-upload` :
      process.env.FILE_VAULT_URL
  }
};
