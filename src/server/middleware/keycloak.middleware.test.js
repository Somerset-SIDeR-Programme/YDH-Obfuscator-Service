const httpMocks = require('node-mocks-http');
const keycloakMiddleware = require('./keycloak.middleware');

describe('Keycloak middleware', () => {
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
});
