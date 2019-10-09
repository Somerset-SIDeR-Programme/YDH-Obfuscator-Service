const serverConfig = {
	https: false,
	name: 'Contextual-Link-Parser',
	port: '8204',
	ssl: {
		cert: './ssl_certs/ydhclientcert.cer',
		key: './ssl_certs/ydhclientcert.key'
	}
};

const obfuscationConfig = {
	obfuscation: {
		encryptionKey: {
			name: 'k01',
			value: '0123456789'
		},
		obfuscate: [
			'birthdate',
			'patient'
		],
		requiredParams: [
			'patient',
			'birthdate',
			'location',
			'practitioner'
		]
	}
};

module.exports = {
	obfuscationConfig,
	serverConfig
};
