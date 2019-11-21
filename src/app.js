const { obfuscationConfig, serverConfig } = require('./config');
const { keycloakRetrieveConfig } = require('./keycloak-retrieve.config');
const Server = require('./server/server');

new Server(serverConfig)
	// Comment back in when wanting to use keycloak
	// .configureKeycloakRetrival(keycloakRetrieveConfig)
	.configureObfuscation(obfuscationConfig.obfuscation)
	.configureRoute()
	.listen(serverConfig.port);
