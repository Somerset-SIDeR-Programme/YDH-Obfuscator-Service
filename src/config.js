require('custom-env').env();

const serverConfig = {
	https: process.env.USE_HTTPS || false,
	port: process.env.PORT || 8204,
	host: process.env.HOST,
	recievingEndpoint: 'https://pyrusapps.blackpear.com/esp/#!/launch?',
	ssl: {
		cert: process.env.SSL_CERT_PATH,
		key: process.env.SSL_KEY_PATH,
		pfx: {
			passphrase: process.env.PFX_PASSPHRASE,
			pfx: process.env.PFX_FILE_PATH
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
				NOUNLOCK: { type: 'number' }
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
		url: ''
	}
};

const loggerConfig = {
	// Pino options: https://github.com/pinojs/pino-http#custom-serializers
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

	// Rotation options: https://github.com/rogerc/file-stream-rotator/#options
	rotation: {
		filename: `${process.cwd()}/logs/obs-service-%DATE%.log`,
		frequency: 'daily',
		verbose: false,
		date_format: 'YYYY-MM-DD'
	}
};

module.exports = {
	keycloakRetrieveConfig,
	loggerConfig,
	serverConfig
};
