const {
	serverConfig,
	loggerConfig,
	keycloakRetrieveConfig
} = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureHelmet()
	.configureLogging(loggerConfig)
	.configureKeycloakRetrival(keycloakRetrieveConfig)
	.configureRoutes()
	.configureErrorHandling()
	.listen();
