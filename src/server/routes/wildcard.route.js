const { Router } = require('express');
const queryString = require('querystring');

const router = new Router();

// Import middleware
const sanitize = require('sanitize-middleware');
const obfuscate = require('../middleware/obfuscate.middleware');

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {Object} options
 * @param {Object} options.config
 * @returns {Router} Express router instance.
 */
module.exports = function wildcardRoute(options) {
	const { config } = options;

	router.use(
		sanitize(config.obfuscation.requiredProperties),

		obfuscate(
			config.obfuscation,
			config.obfuscation.requiredProperties.query
		)
	);

	router.route('*').get((req, res) => {
		const espUrl =
			config.recievingEndpoint + queryString.stringify(req.query);
		console.log(espUrl);
		res.redirect(espUrl);
	});

	return router;
};
