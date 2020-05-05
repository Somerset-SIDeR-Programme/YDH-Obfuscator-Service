const request = require('axios');
const queryString = require('querystring');

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
 * @param {String} config.requestToken.url
 *
 * @return {Function} Express middleware.
 */
module.exports = function keycloakMiddleware(config = {}) {
	return async (req, res, next) => {
		// Don't attempt to retrieve access tokens if config not supplied
		if (Object.keys(config).length === 0) {
			next();
		} else {
			try {
				const { requestToken, serviceAuthorisation } = config;

				// Service authorisation to retrieve subject access token
				const serviceAuthResponse = await request.post(
					serviceAuthorisation.url,
					queryString.stringify(serviceAuthorisation.form)
				);

				requestToken.form.subject_token =
					serviceAuthResponse.data.access_token;

				// Expects the practitioner query to be in [system]|[code] format
				requestToken.form.requested_subject = req.query.practitioner.split(
					'|'
				)[1];

				// Request access token for user
				const userAccessResponse = await request.post(
					requestToken.url,
					queryString.stringify(requestToken.form)
				);
				req.query.access_token = userAccessResponse.data.access_token;
				next();
			} catch (error) {
				res.status(500);
				next(new Error(error));
			}
		}
	};
};
