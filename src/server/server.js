const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const { obfuscate } = require('obfuscated-querystring/lib');

const keycloakRetrieve = require('./middleware/keycloak-retrieve.middleware');
const keycloakConfig = require('../keycloak-retrieve.config');

function serialise(obj, prefix) {
	const str = [];
	Object.keys(obj).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const k = prefix ? `${prefix}[${key}]` : key;
			const value = obj[key];
			str.push((value !== null && typeof value === 'object')
				? serialise(value, k)
				: `${encodeURIComponent(k)}=${encodeURIComponent(value)}`);
		}
	});
	return str.join('&');
}

class Server {
	/**
	 * @class
	 * @param {Object} config - Server configuration values.
	 */
	constructor(config = {}) {
		// Define any default settings the server should have to get up and running
		const defaultConfig = {
			https: false,
			name: ''
		};
		this.config = Object.assign(defaultConfig, config);

		this.config = config;
		// Setup our express instance
		this.app = express();

		// Use helmet for basic HTTP security header settings (doesn't matter as it is redirected)
		this.app.use(helmet());

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Sets routing options for Express server.
	 * @param {Object} options - Route configuration values.
	 * @returns {this} self
	 */
	configureRoute(options) {
		this.app.get('/', keycloakRetrieve(keycloakConfig.keycloakRetrieveConfig), (req, res) => {
			// Retrieve all param keys from query and check all essential ones are present
			const keys = Object.keys(req.query);

			// eslint-disable-next-line max-len
			if (options.requiredParams.every((element) => keys.map((x) => x.toLowerCase()).includes(element.toLowerCase()))) {
				const obfuscatedParams = obfuscate(serialise(req.query), options);
				const espUrl = `https://pyrusapps.blackpear.com/esp/#!/launch?${obfuscatedParams}`;
				console.log(espUrl);
				res.redirect(espUrl);
			} else {
				res.status(400).send('An essential parameter is missing');
			}
		});

		// return self for chaining
		return this;
	}

	/**
	 * @author Frazer Smith
	 * @description Start the server.
	 * @param {string} port - Port for server to listen on.
	 * @returns {this} self
	 */
	listen(port) {
		const server = this.config;
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
		this.app.listen(port);
		console.log(`${server.name} listening for requests at ${this.config.protocol}://127.0.0.1:${port}`);

		// return self for chaining
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
