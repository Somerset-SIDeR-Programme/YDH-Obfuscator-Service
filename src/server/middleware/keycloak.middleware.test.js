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
		expect(req.query.access_token).toBe('mock-access-token-authorised');
		expect(res.statusCode).not.toBe(500);
	});

	test('Should throw error if connection issue encountered', async () => {
		const altKeycloakConfig = { ...keycloakRetrieveConfig };
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
		expect(res.statusCode).toBe(500);
	});
});
