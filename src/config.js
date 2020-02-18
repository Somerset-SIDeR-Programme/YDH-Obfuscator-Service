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
		requiredParams: {
			patient: 'string',
			birthdate: 'string',
			location: 'string',
			practitioner: 'string'
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
			requested_token_type: 'urn:ietf:params:oauth:token-type:access_token'
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

// Refer to option documention: https://github.com/winstonjs/winston-daily-rotate-file/blob/master/README.md#options
const winstonRotateConfig = {
	auditFile: 'logs/logging-audit.json',
	datePattern: 'YYYY-MM-DD',
	dirname: 'logs',
	extension: '.json',
	filename: 'obs-service-log-%DATE%',
	maxFiles: '14d',
	maxSize: '20m',
	zippedArchive: true
};

module.exports = {
	keycloakRetrieveConfig,
	serverConfig,
	winstonRotateConfig
};
