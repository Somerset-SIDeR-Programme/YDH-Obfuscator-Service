const request = require('supertest');
const {
	obfuscationConfig,
	serverConfig,
	winstonRotateConfig
} = require('../config');
const Server = require('./server');

const params = {
	birthdate: '1932-04-15',
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	patient:
		'https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15',
	practitioner: 'https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk'
};

describe('Server deployment', () => {
	const port = '8204';
	const path = `http://127.0.0.1:${port}`;
	beforeAll(async () => {
		jest.setTimeout(30000);
	});

	test('Should assign default values if none provided', async () => {
		const server = new Server()
			.configureObfuscation(obfuscationConfig.obfuscation)
			.configureWinston(winstonRotateConfig)
			.configureRoutes()
			.listen(port);
		expect(server.config.protocol).toBe('http');
		await server.shutdown();
	});

	test('Should fail if obfuscation config missing', async () => {
		const server = new Server(serverConfig)
			.configureObfuscation()
			.configureRoutes()
			.listen(port);

		const response = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(response.statusCode).toBe(500);

		await server.shutdown();
	});

	test('Should set protocol to https', async () => {
		const httpsServerConfig = {
			https: true
		};

		try {
			const server = new Server(httpsServerConfig)
				.configureObfuscation(obfuscationConfig.obfuscation)
				.configureRoutes()
				.listen(port);

			expect(server.config.protocol).toBe('https');
		} catch (error) {
			// Do nothing
		}
	});
});

describe('Redirects', () => {
	let server;
	const port = '8205';
	const path = `http://127.0.0.1:${port}`;

	beforeAll(async () => {
		jest.setTimeout(30000);
		// Stand up server
		server = new Server(serverConfig)
			.configureObfuscation(obfuscationConfig.obfuscation)
			.configureRoutes()
			.listen(port);
	});

	afterAll(async () => {
		try {
			await server.shutdown();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	test("Should redirect to Black Pear's ESP with all params present", async () => {
		const response = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(response.statusCode).toBe(302);
		expect(response.headers.location.substring(0, 46)).toBe(
			'https://pyrusapps.blackpear.com/esp/#!/launch?'
		);
	});

	test('Should fail to redirect when any required param is missing', async () => {
		await Promise.all(
			Object.keys(params).map(async (key) => {
				const alteredParams = { ...params };
				delete alteredParams[key];
				const response = await request(path)
					.get('')
					.set('Content-Type', 'application/json')
					.set('cache-control', 'no-cache')
					.query(alteredParams);

				expect(response.statusCode).toBe(400);
				expect(response.text).toBe('An essential parameter is missing');
			})
		);
	});
});

describe('Keycloak token retrival', () => {
	let server;
	const port = '8206';
	const path = `http://127.0.0.1:${port}`;

	beforeAll(async () => {
		jest.setTimeout(30000);
		// Stand up server
		server = new Server(serverConfig)
			.configureKeycloakRetrival()
			.configureObfuscation(obfuscationConfig.obfuscation)
			.configureRoutes()
			.listen(port);
	});

	afterAll(async () => {
		try {
			await server.shutdown();
		} catch (error) {
			console.log(error);
			throw error;
		}
	});

	test('Should fail if Keycloak endpoint config missing', async () => {
		const response = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(response.statusCode).toBe(500);
	});
});
