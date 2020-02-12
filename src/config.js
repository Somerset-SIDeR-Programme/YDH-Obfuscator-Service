const serverConfig = {
	https: false,
	port: 8204,
	recievingEndpoint: 'https://pyrusapps.blackpear.com/esp/#!/launch?',
	ssl: {
		cert: './ssl_certs/ydhclientcert.cer',
		key: './ssl_certs/ydhclientcert.key',
		pfx: {
			passphrase: '',
			pfx: './ssl_certs/ydhwildcard.pfx'
		}
	},
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

// Refer to option documention here: https://github.com/winstonjs/winston-daily-rotate-file/blob/master/README.md#options
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
