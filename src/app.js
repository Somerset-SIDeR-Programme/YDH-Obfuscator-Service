'use strict';
const expressServer = require('./expressServer');

// If USE_HTTPS set to true, server will use the ssl key and cert in the object to provide HTTPS.
const serverConfig = {
	name : 'Contextual-Link-Parser',
	port : '8204',
	USE_HTTPS: false,
	ssl : {
		key : './ssl_certificate/ydhclientcert.key',
		cert : './ssl_certificate/ydhclientcert.cer'
	}
};


/**
 * Obfuscate array contains list of query params to obfuscate and encryption key
 * (real key will be provided by Black Pear at later date, this is only a test one!)
*/

const obfuscationConfig = {
	obfuscate : ['birthdate', 'patient'],
	encryptionKey : {
		name : 'k01',
		value: '0123456789'
	}
};


var server = new expressServer(serverConfig);
server.configureRoute(obfuscationConfig);
server.listen(serverConfig.port);