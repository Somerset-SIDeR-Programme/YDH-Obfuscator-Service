const { obfuscationConfig, serverConfig } = require('./config');
const { keycloakRetrieveConfig } = require('./keycloak-retrieve.config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureKeycloakRetrival(keycloakRetrieveConfig)
	.configureObfuscation(obfuscationConfig.obfuscation)
	.configureRoute()
	.listen(serverConfig.port);
