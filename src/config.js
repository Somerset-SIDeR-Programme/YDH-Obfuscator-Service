require('custom-env').env();

const serverConfig = {
	https: process.env.USE_HTTPS || false,
	port: process.env.PORT || 8204,
	host: process.env.HOST,
	redirectUrl: process.env.REDIRECT_URL,
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
		requiredProperties: ['birthdate', 'location', 'patient', 'practitioner']
	}
};

const keycloakRetrieveConfig = {
	// Request access token for user
	requestToken: {
		form: {
			audience: process.env.KC_REQUESTTOKEN_AUDIENCE,
			client_id: process.env.KC_REQUESTTOKEN_CLIENT_ID,
			client_secret: process.env.KC_REQUESTTOKEN_CLIENT_SECRET,
			grant_type:
				process.env.KC_REQUESTTOKEN_GRANT_TYPE ||
				'urn:ietf:params:oauth:grant-type:token-exchange',
			requested_subject: process.env.KC_REQUESTTOKEN_REQUESTED_SUBJECT,
			requested_token_type:
				process.env.KC_REQUESTTOKEN_REQUESTED_TOKEN_TYPE ||
				'urn:ietf:params:oauth:token-type:access_token'
		},
		url: process.env.KC_REQUESTTOKEN_URL
	},
	// Service authorisation to retrieve subject access token
	serviceAuthorisation: {
		form: {
			client_id: process.env.KC_SERVICEAUTH_CLIENT_ID,
			client_secret: process.env.KC_SERVICEAUTH_CLIENT_SECRET,
			grant_type: process.env.KC_SERVICEAUTH_GRANT_TYPE,
			password: process.env.KC_SERVICEAUTH_PASSWORD,
			username: process.env.KC_SERVICEAUTH_USERNAME
		},
		url: process.env.KC_SERVICEAUTH_URL
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
