const request = require('axios');
const queryString = require('querystring');

/**
 * @author Frazer Smith
 * @description Retrieves Keycloak access token for passed practitioner.
 * @param {object} config - Keycloak endpoint access config values.
 *
 * @param {object} config.serviceAuthorisation
 * @param {object} config.serviceAuthorisation.form
 * @param {string} config.serviceAuthorisation.form.client_id
 * @param {string} config.serviceAuthorisation.form.client_secret
 * @param {string} config.serviceAuthorisation.form.grant_type
 * @param {string} config.serviceAuthorisation.form.password
 * @param {string} config.serviceAuthorisation.form.username
 * @param {string} config.serviceAuthorisation.url
 *
 * @param {object} config.requestToken
 * @param {object} config.requestToken.form
 * @param {string} config.requestToken.form.audience
 * @param {string} config.requestToken.form.client_id
 * @param {string} config.requestToken.form.client_secret
 * @param {string} config.requestToken.form.grant_type
 * @param {string} config.requestToken.form.request_subject
 * @param {string} config.requestToken.form.request_token_type
 * @param {string} config.requestToken.url
 *
 * @returns {Function} Express middleware.
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
