'use strict';
const expressServer = require('./expressServer');
const fs = require('fs');

// Retrieve config values
const rawData = fs.readFileSync('./src/config.json');
const serverConfig = JSON.parse(rawData);

var server = new expressServer(serverConfig);
server.configureRoute(serverConfig.obfuscation);
server.listen(serverConfig.port);