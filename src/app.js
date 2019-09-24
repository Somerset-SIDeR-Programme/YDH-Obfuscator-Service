const fs = require('fs');
const Server = require('./server/server');

// Retrieve config values
const rawData = fs.readFileSync('./src/config.json');
const serverConfig = JSON.parse(rawData);

new Server(serverConfig)
	.configureRoute(serverConfig.obfuscation)
	.listen(serverConfig.port);
