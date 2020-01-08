// eslint-disable-next-line no-unused-vars
const { obfuscationConfig, serverConfig, keycloakRetrieveConfig } = require('./config');
const Server = require('./server/server');

new Server(serverConfig)
  // Comment back in when wanting to use keycloak
  // .configureKeycloakRetrival(keycloakRetrieveConfig)
  .configureObfuscation(obfuscationConfig.obfuscation)
  .configureRoute()
  .listen(serverConfig.port);
