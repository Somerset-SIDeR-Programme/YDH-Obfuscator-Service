const request = require('request-promise');

/**
 * @author Frazer Smith
 * @description
 * @param {Object} config - Keycloak endpoint access config values.
 * @return {Function} express middleware
 */
module.exports = function keycloakRetrieveMiddleware(config) {
	return async (req, res, next) => {
		const requestToken = config.requestToken;

		// Service authorisation to retrieve subject access token
		const serviceAuth = await request.post(config.serviceAuthorisation);
		requestToken.form.subject_token = JSON.parse(serviceAuth).access_token;
		// Implement in LIVE
		// requestToken.form.requested_subject = req.query.practitioner.split('|')[1];

		// Request access token for user
		const userAccess = await request.post(requestToken);
		req.query.status_token = JSON.parse(userAccess).access_token;
		next();
	};
};
