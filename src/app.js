const {
	obfuscationConfig,
	serverConfig,
	// eslint-disable-next-line no-unused-vars
	keycloakRetrieveConfig,
	winstonRotateConfig
} = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	// Comment back in when wanting to use keycloak
	// .configureKeycloakRetrival(keycloakRetrieveConfig)
	.configureObfuscation(obfuscationConfig.obfuscation)
	.configureWinston(winstonRotateConfig)
	.configureRoutes()
	.listen(serverConfig.port);
