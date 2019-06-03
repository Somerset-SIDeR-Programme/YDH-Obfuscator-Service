/* eslint-disable no-console */
'use strict';
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const obfuscate = require('../node_modules/obfuscated-querystring/lib').obfuscate;

class expressServer {

	/**
	 * @class
	 * @param {Object} config - Server configuration values.
	 */
	constructor(config = {}) {

		this.config = config;
		// Setup our express instance
		this.app = express();
		this.app.use(helmet());
		// return self for chaining
		return this;
	}


	/**
	 * @author Frazer Smith
	 * @summary Start the server.
	 * @param {string} port - Port for server to listen on. 
	 */
	listen(port, callback) {

		const server = this.config;
		let protocol;
		// Update the express app to be an instance of createServer
		if (server.USE_HTTPS == true) {
			this.app = https.createServer({
				key: fs.readFileSync(server.ssl.key),
				cert: fs.readFileSync(server.ssl.cert)
			}, this.app);
			protocol = 'https';

		} else {
			protocol = 'http';
			this.app = http.createServer(this.app);
		}

		// Start the app
		this.app.listen(port, callback);
		console.log(`${server.name} listening for requests at ${protocol}://127.0.0.1:${port}`);
	}


	/**
	 * @author Frazer Smith
	 * @summary Sets routing options for Express server.
	 * @param {Object} options 
	 */
	configureRoute(options) {

		this.app.get('/', function (req, res) {

			/** 
			 * Remove preceding /? from string so it can be used in obfuscation method
			 * BlackPear provided.
			 */
			let newUrl = req.originalUrl.substring(2, req.originalUrl.length);

			// Retrieve all param keys from query and check all essential ones are present
			let keys = Object.keys(req.query);
			if (options['requiredParams'].every(element => keys.map(function (x) { return x.toUpperCase(); }).includes(element.toUpperCase()))) {
				try {
					let obfuscatedParams = obfuscate(newUrl, options);
					let espUrl = `https://pyrusapps.blackpear.com/esp/#!/launch?${obfuscatedParams}`;
					console.log(espUrl);
					res.redirect(espUrl);
				} catch (error) {
					res.status(500).send(error);
				}
			} else {
				res.status(400).send('An essential parameter is missing');
			}
		});
	}
}

module.exports = expressServer;