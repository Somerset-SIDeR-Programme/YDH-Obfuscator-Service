const fs = require('fs');
const ExpressServer = require('./expressServer');

// Retrieve config values
const rawData = fs.readFileSync('./src/config.json');
const serverConfig = JSON.parse(rawData);

const server = new ExpressServer(serverConfig);
server.configureRoute(serverConfig.obfuscation);
server.listen(serverConfig.port);
