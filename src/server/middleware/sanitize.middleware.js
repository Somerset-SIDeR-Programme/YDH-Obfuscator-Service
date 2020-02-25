const moment = require('moment');
const sanitize = require('sanitize-html');
const validator = require('validator');
const xss = require('xss');

/**
 * @author Frazer Smith
 * @description Attempts to derive type of value.
 * @param {*} value
 * @returns {String} type of value.
 */
function deriveType(value) {
	let result;
	if (typeof value === 'object') {
		result = 'object';
	} else if (
		value === 'true' ||
		value === 'false' ||
		typeof value === 'boolean'
	) {
		result = 'boolean';
	} else if (
		(!Number.isNaN(value) && typeof value === 'number') ||
		(validator.isFloat(value) && typeof value === 'string')
	) {
		result = 'number';
	} else if (moment(value, moment.ISO_8601, true).isValid()) {
		result = 'date';
	} else {
		result = 'string';
	}

	return result;
}

/**
 * @author Frazer Smith
 * @description Validate that value is of type passed.
 * @param {String} value
 * @param {('boolean'|'date'|'json'|'number'|'object'|'string')=} type - Expected type of value.
 * @returns {Boolean} confirmation that value is valid.
 */
function validateType(value, type) {
	let result;
	switch (type) {
		case 'boolean':
			result =
				value === 'true' ||
				value === 'false' ||
				typeof value === 'boolean';
			break;
		case 'date':
			result = moment(value, undefined, true).isValid();
			break;
		case 'json':
			result = typeof JSON.parse(value) === 'object';
			break;
		case 'number':
			result =
				(!Number.isNaN(value) && typeof value === 'number') ||
				(validator.isFloat(value) && typeof value === 'string');
			break;
		case 'object':
			result = typeof value === 'object';
			break;
		case 'string':
			result = typeof value === 'string';
			break;
		default:
			result = false;
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Sanitizes value based on type passed.
 * @param {String} value
 * @param {('boolean'|'date'|'json'|'number'|'object'|'string')=} type - Expected type of value.
 * @returns {String} parsed value.
 */
function parseValue(value, type) {
	let result;
	switch (type.toLowerCase()) {
		case 'boolean':
			if (typeof value === 'boolean') {
				result = value;
			} else {
				result = validator.toBoolean(value, true);
			}
			break;
		case 'date':
			result = moment(value, undefined, true).toDate();
			break;
		case 'json':
			result = JSON.parse(value);
			break;
		case 'number':
			if (!Number.isNaN(value) && typeof value === 'number') {
				result = value;
			} else {
				result = validator.toFloat(value);
			}
			break;
		case 'object':
			result = JSON.parse(JSON.stringify(value));
			break;
		default:
		case 'string':
			// Strip any HTML tags, non-word characters, and control characters
			result = validator.stripLow(xss(sanitize(value))).trim();
			break;
	}
	return result;
}

/**
 * @author Frazer Smith
 * @description Check all mandatory arguments are present then
 * attempt to validate and sanitize all arguments passed.
 * @param {Object} args
 * @param {Object=} config - Objects containing accepted arguments as properties, and their types as values.
 * @returns {Error|String}
 */
function parseValues(args, config) {
	const values = args;
	const keys = Object.keys(values);
	let message;

	// check mandatory values are present
	const mandatoryArgs = [];
	Object.keys(config).forEach((configKey) => {
		if (
			config[configKey].mandatory &&
			config[configKey].mandatory === true
		) {
			mandatoryArgs.push(configKey);
		}
	});

	if (
		mandatoryArgs.every((element) =>
			keys.map((x) => x.toLowerCase()).includes(element.toLowerCase())
		) === false
	) {
		message = `A mandatory parameter is missing from the list: ${mandatoryArgs
			.join(', ')
			.toString()}`;
		return new Error(message);
	}

	/**
	 * Compare arguments to accepted arguments in config file.
	 * If config is empty then accept every argument, and
	 * attempt to derive type for sanitizing.
	 */
	keys.forEach((key) => {
		if (
			Object.prototype.hasOwnProperty.call(config, key) &&
			config[key].type &&
			validateType(values[key], config[key].type)
		) {
			values[key] = parseValue(values[key], config[key].type);
		} else if (Object.keys(config).length === 0) {
			const type = deriveType(values[key]);
			if (validateType(values[key], type)) {
				values[key] = parseValue(values[key], type);
			}
		} else {
			message = `Invalid option provided: ${key}`;
		}
	});
	if (typeof message !== 'undefined') {
		return new Error(message);
	}
	return values;
}

/**
 * @author Frazer Smith
 * @description Check all mandatory values are present and then validate
 * and sanitize query, param and body of requests to protect against
 * cross-site scripting (XSS) and command injection attacks.
 * @param {Object.<string, {type: string, mandatory: boolean}>=} config - Sanitization configuration values.
 * @return {Function} Express middleware.
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
				res.status(400);
				return next(req.query);
			}
		}
		if (
			req.body &&
			['PUT', 'POST'].includes(req.method) &&
			Object.keys(req.body).length
		) {
			req.body = parseValues(req.body, config);
			if (req.body instanceof Error) {
				res.status(400);
				return next(req.body);
			}
		}
		if (req.params && Object.keys(req.params).length) {
			req.params = parseValues(req.params, config);
			if (req.params instanceof Error) {
				res.status(400);
				return next(req.params);
			}
		}
		return next();
	};
};
