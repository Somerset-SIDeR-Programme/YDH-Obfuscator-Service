const { obfuscate } = require('obfuscated-querystring/lib');
const queryString = require('query-string');

/**
 * @author Frazer Smith
 * @description Obfuscates request query string keys and values.
 * @param {Object} config - Obfuscation values.
 * @param {Object} config.encryptionKey
 * @param {String} config.encryptionKey.name - Encryption key name.
 * @param {String} config.encryptionKey.value - Encryption key value.
 * @param {Array} config.obfuscate - Query values that should be obfuscated.
 * @param {Array|Object} requiredProperties - Query values that are essential and needed for requesting.
 * @return {Function} Express middleware.
 */
module.exports = function obfuscateMiddleware(config, requiredProperties) {
	return (req, res, next) => {
		let values = [];
		let keyArray = [];

		// Retrieve all param keys from query and check all essential ones are present
		if (req.query && Object.keys(req.query).length) {
			values = Object.keys(req.query);
		} else {
			res.status(400);
			return next(new Error('Query string missing from request'));
		}

		//	If object provided then take keys of object to then be parsed
		if (requiredProperties) {
			if (Array.isArray(requiredProperties)) {
				keyArray = requiredProperties;
			} else if (typeof requiredProperties === 'object') {
				keyArray = Object.keys(requiredProperties);
			} else {
				res.status(500);
				return next(
					new Error(
						'List of required query keys not passed to server middleware in correct type'
					)
				);
			}
		}

		try {
			if (
				keyArray.every((element) =>
					values
						.map((x) => x.toLowerCase())
						.includes(element.toLowerCase())
				)
			) {
				const obfuscatedParams = obfuscate(
					queryString.stringify(req.query),
					config
				);

				req.query = queryString.parse(obfuscatedParams);
			} else {
				res.status(400);
				return next(new Error('An essential parameter is missing'));
			}
		} catch (error) {
			res.status(500);
			return next(new Error(error));
		}

		return next();
	};
};
