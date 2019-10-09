const { obfuscationConfig, serverConfig } = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
	.configureRoute(obfuscationConfig.obfuscation)
	.listen(serverConfig.port);
