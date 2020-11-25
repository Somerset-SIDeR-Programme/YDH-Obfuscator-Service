const { Router } = require('express');
const queryString = require('querystring');

const router = new Router();

// Import middleware
const sanitize = require('sanitize-middleware');
const obfuscate = require('../middleware/obfuscate.middleware');

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {object} options - Object containing route config objects.
 * @returns {Router} Express router instance.
 */
module.exports = function wildcardRoute(options) {
	const config = options;

	router.use(
		sanitize(),
		obfuscate(config.obfuscation, config.obfuscation.requiredProperties)
	);

	router.route('*').get((req, res, next) => {
		if (config.redirectUrl) {
			/**
			 * Remove query params that TrakCare adds that leads to the resulting
			 * URL going over the 2048 max character length for IE 11
			 */
			const trakcareQueryParams = [
				'fromiconprofile',
				'nounlock',
				'tpagid'
			];
			Object.keys(req.query).forEach((key) => {
				if (trakcareQueryParams.includes(key.toLowerCase())) {
					delete req.query[key];
				}
			});

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
