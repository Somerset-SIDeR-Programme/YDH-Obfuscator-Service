const httpMocks = require('node-mocks-http');
const keycloakMiddleware = require('./keycloak.middleware');
const {
	keycloakRetrieveConfig
} = require('../../../mocks/keycloak-config.mock');
const mockKeycloakServer = require('../../../mocks/keycloak-server.mock');

describe('Keycloak middleware', () => {
	afterAll(async () => {
		// Shutdown mock Keycloak server
		try {
			await mockKeycloakServer.close();
			setImmediate(() => {
				mockKeycloakServer.emit('close');
			});
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	test('Should return a middleware function', () => {
		const middleware = keycloakMiddleware();
		expect(typeof middleware).toBe('function');
	});

	test('Should continue if no config values are provided', () => {
		const middleware = keycloakMiddleware();

		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should return access_token', async () => {
		const middleware = keycloakMiddleware(keycloakRetrieveConfig);

		const req = httpMocks.createRequest({
			query: {
				practitioner:
					'https://sider.ydh.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
			}
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		await middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
		expect(req.query.access_token).toBe('mock-access-token-authorised');
		expect(res.statusCode).toBe(200);
	});

	test('Should throw type error if url value missing when retrieving request token', async () => {
		const altKeycloakConfig = JSON.parse(JSON.stringify(keycloakRetrieveConfig));
		delete altKeycloakConfig.requestToken.url;

		const middleware = keycloakMiddleware(altKeycloakConfig);

		const req = httpMocks.createRequest({
			query: {
				practitioner:
					'https://sider.ydh.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
			}
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		await middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'TypeError [ERR_INVALID_ARG_TYPE]: The "url" argument must be of type string. Received undefined'
		);
		expect(res.statusCode).toBe(500);
	});

	test('Should throw type error if url value missing when making service authorisation', async () => {
		const altKeycloakConfig = JSON.parse(JSON.stringify(keycloakRetrieveConfig));
		delete altKeycloakConfig.serviceAuthorisation.url;

		const middleware = keycloakMiddleware(altKeycloakConfig);

		const req = httpMocks.createRequest({
			query: {
				practitioner:
					'https://sider.ydh.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
			}
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		await middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'TypeError [ERR_INVALID_ARG_TYPE]: The "url" argument must be of type string. Received undefined'
		);
		expect(res.statusCode).toBe(500);
	});

	test('Should throw error if connection issue encountered when retrieving request token', async () => {
		const altKeycloakConfig = JSON.parse(JSON.stringify(keycloakRetrieveConfig));
		altKeycloakConfig.requestToken.url = 'test';

		const middleware = keycloakMiddleware(altKeycloakConfig);

		const req = httpMocks.createRequest({
			query: {
				practitioner:
					'https://sider.ydh.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
			}
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		await middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Error: connect ECONNREFUSED 127.0.0.1:80'
		);
		expect(res.statusCode).toBe(500);
	});

	test('Should throw error if connection issue encountered when making service authorisation', async () => {
		const altKeycloakConfig = JSON.parse(JSON.stringify(keycloakRetrieveConfig));
		altKeycloakConfig.serviceAuthorisation.url = 'test';

		const middleware = keycloakMiddleware(altKeycloakConfig);

		const req = httpMocks.createRequest({
			query: {
				practitioner:
					'https://sider.ydh.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
			}
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		await middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Error: connect ECONNREFUSED 127.0.0.1:80'
		);
		expect(res.statusCode).toBe(500);
	});
});
