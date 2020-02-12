const {
	serverConfig,
	// eslint-disable-next-line no-unused-vars
	keycloakRetrieveConfig,
	winstonRotateConfig
} = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	// Comment back in when wanting to use keycloak
	// .configureKeycloakRetrival(keycloakRetrieveConfig)
	.configureHelmet()
	.configureObfuscation()
	.configureWinston(winstonRotateConfig)
	.configureRoutes()
	.listen();
