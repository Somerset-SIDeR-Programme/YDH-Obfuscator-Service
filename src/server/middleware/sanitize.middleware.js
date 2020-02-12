const sanitize = require('sanitize-html');
const validator = require('validator');
const xss = require('xss');

function parseValue(value, type) {
	let result;
	switch (type) {
		case 'number':
			result = validator.toFloat(value);
			break;
		case 'boolean':
			result = validator.toBoolean(value);
			break;
		case 'string':
			// Strip any HTML tags, non-word characters, and control characters
			result = validator.stripLow(xss(sanitize(value))).trim();
			break;
		case 'object':
			result = JSON.parse(JSON.stringify(value));
			break;
		case 'json':
			result = JSON.parse(value);
			break;
		default:
			// Pass the value through, unknown types will fail when being validated
			result = value;
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Attempt to parse and sanitize all arguments passed if they're valid.
 *
 * @param {Object} args
 * @param {Object} config - Objects containing accepted arguments as properties, and their types as values.
 */
function parseValues(args, config) {
	const values = args;
	let message;

	Object.keys(values).forEach((key) => {
		// Compare arguments to accepted arguments
		if (Object.prototype.hasOwnProperty.call(config, key)) {
			values[key] = parseValue(values[key], config[key]);
		} else {
			message = `Invalid option provided '${key}'`;
		}
	});
	if (typeof message !== 'undefined') {
		return new Error(message);
	}
	return values;
}

/**
 * @author Frazer Smith
 * @description Sanitize and validate query, param and body of requests
 * to protect against cross-site scripting (XSS) and command injection attacks.
 *
 * @param {Object=} config - sanitization configuration values.
 * @return {Function} express middleware.
 */
module.exports = function sanitizeMiddleware(config = {}) {
	return (req, res, next) => {
		if (
			req.query &&
			req.method === 'GET' &&
			Object.keys(req.query).length
		) {
			req.query = parseValues(req.query, config);
			if (req.query instanceof Error) {
				res.status(400).send(req.query.message);
			}
		}
		if (
			req.body &&
			['PUT', 'POST'].includes(req.method) &&
			Object.keys(req.body).length
		) {
			req.body = parseValues(req.body, config);
			if (req.body instanceof Error) {
				res.status(400).send(req.body.message);
			}
		}
		if (req.params && Object.keys(req.params).length) {
			req.params = parseValues(req.params, config);
			if (req.params instanceof Error) {
				res.status(400).send(req.params.message);
			}
		}
		next();
	};
};
