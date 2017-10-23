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
      }
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
    transport: 'ses',
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
