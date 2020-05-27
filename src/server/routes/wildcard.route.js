const { Router } = require('express');
const queryString = require('querystring');

const router = new Router();

// Import middleware
const sanitize = require('sanitize-middleware');
const obfuscate = require('../middleware/obfuscate.middleware');

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {object} options
 * @param {object} options.config
 * @returns {Router} Express router instance.
 */
module.exports = function wildcardRoute(options) {
	const { config } = options;

	router.use(
		sanitize(),
		obfuscate(config.obfuscation, config.obfuscation.requiredProperties)
	);

	router.route('*').get((req, res, next) => {
		if (config.redirectUrl) {
			const espUrl =
				config.redirectUrl + queryString.stringify(req.query);
			console.log(espUrl);
			res.redirect(espUrl);
		} else {
			res.status(500);
			next(new Error('recieving endpoint missing'));
		}
	});

	return router;
};
