const { obfuscate } = require('obfuscated-querystring/lib');
const queryString = require('query-string');

/**
 * @author Frazer Smith
 * @description Obfuscates request parameter keys and values.
 * @param {Object} config - Obfuscation values.
 * @param {Object} config.encryptionKey
 * @param {String} config.encryptionKey.name - Encryption key name.
 * @param {String} config.encryptionKey.value - Encryption key value.
 * @param {Array} config.obfuscate - Parameters that should be obfuscated.
 * @param {Array|Object} config.requiredProperties - Parameters that are essential and needed for requesting.
 * @return {Function} express middleware.
 */
module.exports = function obfuscateMiddleware(config) {
	return (req, res, next) => {
		let values = [];
		let keyArray = [];

		// Retrieve all param keys from query and check all essential ones are present
		if (req.query && Object.keys(req.query).length) {
			values = Object.keys(req.query);
		}

		//	If object provided then take keys of object to then be parsed
		if (config && config.requiredProperties) {
			if (Array.isArray(config.requiredProperties)) {
				keyArray = config.requiredProperties;
			} else if (typeof config.requiredProperties === 'object') {
				keyArray = Object.keys(config.requiredProperties);
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
				next();
			} else {
				res.status(400).send('An essential parameter is missing');
			}
		} catch (error) {
			res.status(500);
		}
	};
};
