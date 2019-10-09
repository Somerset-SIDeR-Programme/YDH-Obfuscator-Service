const request = require('supertest');
const { obfuscationConfig, serverConfig } = require('../config');
const Server = require('./server');

let server;
const params = {
	birthdate: '1932-04-15',
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	patient: 'https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15',
	practitioner: 'https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
};
const path = `http://127.0.0.1:${serverConfig.port}`;

describe('HTTP GET requests', () => {
	beforeAll(async () => {
		// Stand up server
		server = await new Server(serverConfig)
			.configureRoute(obfuscationConfig.obfuscation)
			.listen(serverConfig.port);
	});

	afterAll(async () => {
		try {
			await server.shutdown();
		} catch (e) {
			console.log(e);
			throw e;
		}
	});

	test('Redirects to Black Pear\'s ESP with all params present', async () => {
		const response = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(response.statusCode).toBe(302);
		expect(response.headers.location.substring(0, 46)).toBe('https://pyrusapps.blackpear.com/esp/#!/launch?');
	}, 30000);

	test('Fail to redirect when any required param is missing', () => {
		Object.keys(params).forEach(async (key) => {
			const alteredParams = { ...params };
			delete alteredParams[key];
			const response = await request(path)
				.get('')
				.set('Content-Type', 'application/json')
				.set('cache-control', 'no-cache')
				.query(alteredParams);

			expect(response.statusCode).toBe(400);
			expect(response.text).toBe('An essential parameter is missing');
		});
	}, 30000);
});
