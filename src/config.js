require('custom-env').env();

const pino = require('pino');

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

if (process.env.KC_ENABLED === true) {
	serverConfig.obfuscation.requiredProperties.push('access_token');
}

const keycloakRetrieveConfig = {
	enabled: process.env.KC_ENABLED,
	// Request access token for user
	requestToken: {
		form: {
			audience: process.env.KC_REQUESTTOKEN_AUDIENCE,
			client_id: process.env.KC_REQUESTTOKEN_CLIENT_ID,
			client_secret: process.env.KC_REQUESTTOKEN_CLIENT_SECRET,
			grant_type:
				process.env.KC_REQUESTTOKEN_GRANT_TYPE ||
				'urn:ietf:params:oauth:grant-type:token-exchange',
			requested_subject: undefined,
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
		formatters: {
			level(label) {
				return { level: label };
			}
		},
		// Defaults to `info` if not set in env
		level: process.env.LOGGER_LEVEL || 'info',
		serializers: {
			req(req) {
				return pino.stdSerializers.req(req);
			},
			res(res) {
				return pino.stdSerializers.res(res);
			}
		},
		timestamp: () => {
			return pino.stdTimeFunctions.isoTime();
		}
	},

	// Rotation options: https://github.com/rogerc/file-stream-rotator/#options
	rotation: {
		date_format: process.env.LOGGER_ROTATION_DATE_FORMAT || 'YYYY-MM-DD',
		filename:
			process.env.LOGGER_ROTATION_FILENAME ||
			`${process.cwd()}/logs/obs-service-%DATE%.log`,
		frequency: process.env.LOGGER_ROTATION_FREQUENCY || 'daily',
		max_logs: process.env.LOGGER_ROTATION_MAX_LOG,
		size: process.env.LOGGER_ROTATION_MAX_SIZE,
		verbose: false
	}
};

module.exports = {
	keycloakRetrieveConfig,
	loggerConfig,
	serverConfig
};
