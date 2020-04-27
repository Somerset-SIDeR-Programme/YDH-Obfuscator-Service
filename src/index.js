const { serverConfig, winstonRotateConfig } = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureHelmet()
	.configureLogging(winstonRotateConfig)
	.configureKeycloakRetrival()
	.configureRoutes()
	.configureErrorHandling()
	.listen();
