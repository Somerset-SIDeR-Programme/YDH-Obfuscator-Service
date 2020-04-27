const serverConfig = {
	https: false,
	port: 8204,
	recievingEndpoint: 'https://pyrusapps.blackpear.com/esp/#!/launch?',
	ssl: {
		cert: './ssl_certs/ydhclientcert.cer', // example path
		key: '',
		pfx: {
			passphrase: '',
			pfx: ''
		}
	},
	obfuscation: {
		encryptionKey: {
			name: 'k01',
			value: '0123456789'
		},
		obfuscate: ['birthdate', 'patient'],
		requiredProperties: {
			query: {
				patient: { type: 'string', mandatory: true },
				birthdate: { type: 'string', mandatory: true },
				location: { type: 'string', mandatory: true },
				practitioner: { type: 'string', mandatory: true },
				TPAGID: { type: 'string' },
				FromIconProfile: { type: 'number' },
				NOUNLOCK: { type: 'number' },
				// access_token: { type: 'string' } // uncomment this when KeyCloak is fully implemented
			}
		}
	}
};

// Refer to option documentation: https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/token-exchange/token-exchange.adoc
const keycloakRetrieveConfig = {
	// Request access token for user
	requestToken: {
		form: {
			audience: '',
			client_id: '',
			client_secret: '',
			grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
			requested_subject: '',
			requested_token_type:
				'urn:ietf:params:oauth:token-type:access_token'
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

const loggerConfig = {
	options: {
		serializers: {
			req(req) {
				return {
					url: req.url,
					ip: req.raw.ip,
					headers: req.headers,
					method: req.method,
					query: req.raw.query,
					httpVersion: req.raw.httpVersion
				};
			},
			res(res) {
				return { statusCode: res.statusCode };
			}
		}
	},

	logDirectory: `${process.cwd()}/logs`
};

module.exports = {
	keycloakRetrieveConfig,
	loggerConfig,
	serverConfig
};
