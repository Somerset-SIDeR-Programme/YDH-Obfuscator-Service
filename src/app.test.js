/* eslint-disable no-undef */

const fs = require('fs');
const request = require('supertest');
const ExpressServer = require('./expressServer');

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
	beforeAll(() => {
		// Stand up server
		server = new ExpressServer(config);
		server.configureRoute(config.obfuscation);
		server.listen(config.port);
	});

	afterAll(() => {
		server.close();
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
			const alteredParams = Object.assign({}, params);
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
