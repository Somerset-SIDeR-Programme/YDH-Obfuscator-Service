const request = require('request-promise');

/**
 * @author Frazer Smith
 * @description Retrieves Keycloak access token for passed practitioner.
 * @param {Object} config - Keycloak endpoint access config values.
 *
 * @param {Object} config.serviceAuthorisation
 * @param {Object} config.serviceAuthorisation.form
 * @param {String} config.serviceAuthorisation.form.client_id
 * @param {String} config.serviceAuthorisation.form.client_secret
 * @param {String} config.serviceAuthorisation.form.grant_type
 * @param {String} config.serviceAuthorisation.form.password
 * @param {String} config.serviceAuthorisation.form.username
 * @param {Object} config.serviceAuthorisation.options
 * @param {Object} config.serviceAuthorisation.options.headers
 * @param {String} config.serviceAuthorisation.url
 *
 * @param {Object} config.requestToken
 * @param {Object} config.requestToken.form
 * @param {String} config.requestToken.form.audience
 * @param {String} config.requestToken.form.client_id
 * @param {String} config.requestToken.form.client_secret
 * @param {String} config.requestToken.form.grant_type
 * @param {String} config.requestToken.form.request_subject
 * @param {String} config.requestToken.form.request_token_type
 * @param {Object} config.requestToken.options
 * @param {Object} config.requestToken.options.headers
 * @param {String} config.requestToken.url
 *
 * @return {Function} Express middleware.
 */
module.exports = function keycloakMiddleware(config = {}) {
	return async (req, res, next) => {
		// Don't attempt to retrieve access tokens if testing or if config not supplied
		if (
			process.env.NODE_ENV.toLowerCase() === 'test' ||
			Object.keys(config).length === 0
		) {
			next();
		}

		try {
			const { requestToken, serviceAuthorisation } = config;

			// Service authorisation to retrieve subject access token
			const serviceAuth = await request.post(serviceAuthorisation);
			requestToken.form.subject_token = JSON.parse(
				serviceAuth
			).access_token;

			// Expects the practitioner query to be in [system]|[code] format
			requestToken.form.requested_subject = req.query.practitioner.split(
				'|'
			)[1];

			// Request access token for user
			const userAccess = await request.post(requestToken);
			req.query.access_token = JSON.parse(userAccess).access_token;
			next();
		} catch (error) {
			res.status(500);
			next(new Error(error));
		}
	};
};
