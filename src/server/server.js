const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const { obfuscate } = require('obfuscated-querystring/lib');

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
	 */
	configureRoute(options) {
		this.app.get('/', (req, res) => {
			// Retrieve all param keys from query and check all essential ones are present
			const keys = Object.keys(req.query);
			// eslint-disable-next-line max-len
			if (options.requiredParams.every((element) => keys.map((x) => x.toLowerCase()).includes(element.toLowerCase()))) {
				try {
					// eslint-disable-next-line no-underscore-dangle
					const obfuscatedParams = obfuscate(req._parsedUrl.query, options);
					const espUrl = `https://pyrusapps.blackpear.com/esp/#!/launch?${obfuscatedParams}`;
					console.log(espUrl);
					res.redirect(espUrl);
				} catch (error) {
					res.status(500).send(error);
				}
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
	 */
	listen(port) {
		const server = this.config;
		// Update the express app to be an instance of createServer
		if (server.https === true) {
			this.app = https.createServer({
				cert: fs.readFileSync(server.ssl.cert),
				key: fs.readFileSync(server.ssl.key)
			}, this.app);
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
	 * @returns {Promise}
	 */
	shutdown() {
		return new Promise((resolve) => {
			this.app.close();
			resolve(this);
		});
	}
}

module.exports = Server;
