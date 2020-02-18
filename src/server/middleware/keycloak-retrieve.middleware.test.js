const  keycloakMiddleware = require('./keycloak-retrieve.middleware');

describe('Keycloak middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = keycloakMiddleware();
		expect(typeof middleware).toBe('function');
    });
});