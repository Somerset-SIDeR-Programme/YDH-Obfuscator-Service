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
	 * @param {Object} config - Server configuration values.
	 */
	constructor(config = {}) {
		// Define any default settings the server should have to get up and running
		const defaultConfig = {
			https: false
		};
		this.config = Object.assign(defaultConfig, config);

		// Setup our Express instance
		this.app = express();

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets up error handling for server.
	 * @returns {this} self
	 */
	configureErrorHandling() {
		this.app.use(errorHandler());

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets Helmet options for server.
	 * @param {Object=} helmetConfig - Helmet configuration values.
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
	 * @param {Object} kcConfig - Keycloak endpoint configuration values.
	 * @returns {this} self
	 */
	configureKeycloakRetrival(kcConfig) {
		this.app.use(keycloakRetrieve(kcConfig));

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets routing options for server.
	 * @param {Object} options - Route configuration values.
	 * @returns {this} self
	 */
	configureRoutes() {
		this.app.use('*', wildcardRoute(this));

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets logging options for server.
	 * @param {Object} loggerConfig - Logger configuration values.
	 * @param {Object=} loggerConfig.options
	 * @param {Object} loggerConfig.rotation
	 * @returns {this} self
	 */
	configureLogging(loggerConfig) {
		this.app.use(
			expressPino(
				loggerConfig.options,
				rotatingLogStream.getStream(loggerConfig.rotation)
			)
		);

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Start the server.
	 * @returns {this} self
	 */
	listen() {
		const server = this.config;
		const port = process.env.PORT;
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
		this.app.listen(port || server.port);
		console.log(
			`${process.env.npm_package_name} listening for requests at ${
				this.config.protocol
			}://127.0.0.1:${port || server.port}`
		);

		// Return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Shut down server (non-gracefully).
	 * @returns {Promise<this>} self
	 */
	shutdown() {
		return new Promise((resolve) => {
			this.app.close();
			resolve(this);
		});
	}
}

module.exports = Server;
