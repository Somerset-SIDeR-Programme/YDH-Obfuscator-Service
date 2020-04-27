const { serverConfig, loggerConfig } = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureHelmet()
	.configureLogging(loggerConfig)
	.configureKeycloakRetrival()
	.configureRoutes()
	.configureErrorHandling()
	.listen();
