const express = require('express');
const expressPino = require('express-pino-logger');
const rotatingLogStream = require('file-stream-rotator');
const fs = require('fs');
const helmet = require('helmet');
const http = require('http');
const https = require('https');

// Import middleware
const keycloakRetrieve = require('./middleware/keycloak.middleware');

// Import utils
const errorHandler = require('./utils/error-handler.utils');

// Import routes
const wildcardRoute = require('./routes/wildcard.route');

class Server {
	/**
	 * @param {object} config - Server configuration values.
	 */
	constructor(config) {
		this.config = config;

		// Setup our Express instance
		this.app = express();

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets up error handling for server.
	 * @returns {this} self
	 */
	configureErrorHandling() {
		this.app.use(errorHandler());

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets Helmet options for server.
	 * @param {object=} helmetConfig - Helmet configuration values.
	 * @returns {this} self
	 */
	configureHelmet(helmetConfig) {
		// Use Helmet to set response headers
		this.app.use(helmet(helmetConfig));

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets Keycloak token retrival options for server.
	 * @param {object} kcConfig - Keycloak endpoint configuration values.
	 * @returns {this} self
	 */
	configureKeycloakRetrival(kcConfig) {
		this.app.use(keycloakRetrieve(kcConfig));

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets routing options for server.
	 * @returns {this} self
	 */
	configureRoutes() {
		this.app.use('*', wildcardRoute(this));

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets logging options for server.
	 * @param {object} loggerConfig - Logger configuration values.
	 * @param {object=} loggerConfig.options
	 * @param {object} loggerConfig.rotation
	 * @returns {this} self
	 */
	configureLogging(loggerConfig) {
		this.app.use(
			expressPino(
				loggerConfig.options,
				rotatingLogStream.getStream(loggerConfig.rotation)
			)
		);

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Start the server.
	 * @returns {this} self
	 */
	listen() {
		const server = this.config;

		// Update the Express app to be an instance of createServer
		if (server.https === true) {
			const options = {};
			// Attempt to use PFX file if present
			if (server.ssl.pfx.pfx) {
				options.pfx = fs.readFileSync(server.ssl.pfx.pfx);
				options.passphrase = server.ssl.pfx.passphrase;
			} else {
				options.cert = fs.readFileSync(server.ssl.cert);
				options.key = fs.readFileSync(server.ssl.key);
			}

			this.app = https.createServer(options, this.app);
			this.config.protocol = 'https';
		} else {
			this.config.protocol = 'http';
			this.app = http.createServer(this.app);
		}

		// Start the app
		this.app.listen(server.port, server.host, () => {
			console.log(
				`${process.env.npm_package_name} listening for requests at ${this.config.protocol}://${server.host}:${server.port}`
			);
		});
		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Shut down server (non-gracefully).
	 */
	shutdown() {
		this.app.close();
		setImmediate(() => {
			this.app.emit('close');
		});
	}
}

module.exports = Server;
