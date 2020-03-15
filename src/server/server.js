const express = require('express');
const expressWinston = require('express-winston');
const fs = require('fs');
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const queryString = require('query-string');
const winston = require('winston');
const WinstonRotate = require('winston-daily-rotate-file');

// Import middleware
const sanitize = require('sanitize-middleware');
const keycloakRetrieve = require('./middleware/keycloak.middleware');
const obfuscate = require('./middleware/obfuscate.middleware');

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

		// Setup our express instance
		this.app = express();

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets up basic error handling for server.
	 * @returns {this} self
	 */
	configureErrorHandling() {
		// eslint-disable-next-line no-unused-vars
		this.app.use((err, req, res, next) => {
			res.send(err.message);
		});

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets obfuscation options server.
	 * @returns {this} self
	 */
	configureObfuscation() {
		this.app.use(sanitize(this.config.obfuscation.requiredProperties));
		this.app.use(obfuscate(this.config.obfuscation));

		// return self for chaining
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
	 * @description Sets routing options for server.
	 * @param {Object} options - Route configuration values.
	 * @returns {this} self
	 */
	configureRoutes() {
		this.app.get('/', (req, res, next) => {
			const espUrl =
				this.config.recievingEndpoint +
				queryString.stringify(req.query);
			console.log(espUrl);
			res.redirect(espUrl);
			next();
		});

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets Winston Daily Rotate options for server.
	 * @param {Object} winstonRotateConfig - Winston Daily Rotate configuration values.
	 * @returns {this} self
	 */
	configureWinston(winstonRotateConfig) {
		const transport = new WinstonRotate(winstonRotateConfig);

		this.app.use(
			expressWinston.logger({
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.json()
				),
				requestWhitelist: [
					'url',
					'headers',
					'method',
					'httpVersion',
					'originalUrl',
					'query',
					'ip',
					'_startTime'
				],
				transports: [transport]
			})
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
		// Update the express app to be an instance of createServer
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
