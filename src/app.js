const {
	serverConfig,
	winstonRotateConfig
} = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureKeycloakRetrival()
	.configureHelmet()
	.configureObfuscation()
	.configureWinston(winstonRotateConfig)
	.configureRoutes()
	.listen();
