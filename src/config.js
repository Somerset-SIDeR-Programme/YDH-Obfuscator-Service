const serverConfig = {
  https: false,
  name: 'Contextual-Link-Parser',
  port: 8204,
  ssl: {
    cert: './ssl_certs/ydhclientcert.cer',
    key: './ssl_certs/ydhclientcert.key',
    pfx: {
      passphrase: '',
      pfx: './ssl_certs/ydhwildcard.pfx'
    }
  }
};

const obfuscationConfig = {
  obfuscation: {
    encryptionKey: {
      name: 'k01',
      value: '0123456789'
    },
    obfuscate: ['birthdate', 'patient'],
    requiredParams: ['patient', 'birthdate', 'location', 'practitioner']
  }
};

// Empty example config
const keycloakRetrieveConfig = {
  // Request access token for user
  requestToken: {
    form: {
      audience: '',
      client_id: '',
      client_secret: '',
      grant_type: '',
      requested_subject: '',
      requested_token_type: ''
    },
    options: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    url: ''
  },
  // Service authorisation to retrieve subject access token
  serviceAuthorisation: {
    form: {
      client_id: '',
      client_secret: '',
      grant_type: '',
      password: '',
      username: ''
    },
    options: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    url: ''
  }
};

module.exports = {
  keycloakRetrieveConfig,
  obfuscationConfig,
  serverConfig
};
