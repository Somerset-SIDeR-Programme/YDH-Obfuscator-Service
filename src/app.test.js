
const fs = require('fs');
const request = require('supertest');
const Server = require('./server/server');

// Fetch config
const rawData = fs.readFileSync('./src/config.json');
const config = JSON.parse(rawData);
let server;
const params = {
	BIRTHDATE: '1932-04-15',
	LOCATION: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	PATIENT: 'https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15',
	PRACTITIONER: 'https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
};
const path = `http://127.0.0.1:${config.port}`;

describe('HTTP GET requests', () => {
	beforeAll(async () => {
		// Stand up server
		server = new Server(config)
			.configureRoute(config.obfuscation)
			.listen(config.port);
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
