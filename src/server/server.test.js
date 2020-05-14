const cloneDeep = require('lodash/cloneDeep');
const request = require('supertest');
const { serverConfig } = require('../config');
const Server = require('./server');

const params = {
	birthdate: '1932-04-15',
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	patient:
		'https://fhir.nhs.uk/Id/nhs-number|9467335646&birthdate=1932-04-15',
	practitioner: 'https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk',
	TPAGID: 'M5',
	FromIconProfile: 13,
	NOUNLOCK: 1
};

describe('Server deployment', () => {
	test('Should set protocol to https with cert and key files', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.https = true;
		modServerConfig.ssl.cert = `${process.cwd()}/test_ssl_cert/server.cert`;
		modServerConfig.ssl.key = `${process.cwd()}/test_ssl_cert/server.key`;

		try {
			const server = new Server(modServerConfig)
				.configureHelmet()
				.configureKeycloakRetrival()
				.configureRoutes()
				.configureErrorHandling()
				.listen();

			expect(server.config.protocol).toBe('https');
			server.shutdown();
		} catch (error) {
			// Do nothing
		}
	});

	test('Should set protocol to https with pfx file and passphrase', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.https = true;
		modServerConfig.ssl.pfx.pfx = `${process.cwd()}/test_ssl_cert/server.pfx`;
		modServerConfig.ssl.pfx.passphrase = 'test';

		try {
			const server = new Server(modServerConfig)
				.configureHelmet()
				.configureKeycloakRetrival()
				.configureRoutes()
				.configureErrorHandling()
				.listen();

			expect(server.config.protocol).toBe('https');
			server.shutdown();
		} catch (error) {
			// Do nothing
		}
	});
});

describe('Redirects', () => {
	let server;
	const modServerConfig = cloneDeep(serverConfig);
	modServerConfig.port = 8203;

	const path = `http://0.0.0.0:${modServerConfig.port}`;

	beforeEach(() => {
		server = new Server(modServerConfig)
			.configureHelmet()
			.configureKeycloakRetrival()
			.configureRoutes()
			.configureErrorHandling()
			.listen();
	});

	afterEach(() => {
		server.shutdown();
	});

	test("Should redirect to Black Pear's ESP with all params present", async () => {
		const res = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(res.statusCode).toBe(302);
		expect(res.headers.location.substring(0, 46)).toBe(
			'https://pyrusapps.blackpear.com/esp/#!/launch?'
		);
	});

	test('Should fail to redirect when any required param is missing', async () => {
		const alteredParams = { ...params };
		delete alteredParams.NOUNLOCK;
		delete alteredParams.TPAGID;
		delete alteredParams.FromIconProfile;

		await Promise.all(
			Object.keys(alteredParams).map(async (key) => {
				const scrubbedParams = { ...alteredParams };
				delete scrubbedParams[key];
				const response = await request(path)
					.get('')
					.set('Content-Type', 'application/json')
					.set('cache-control', 'no-cache')
					.query(scrubbedParams);

				expect(response.statusCode).toBe(400);
			})
		);
	});
});

describe('Keycloak token retrival', () => {
	let server;
	const modServerConfig = cloneDeep(serverConfig);
	modServerConfig.port = 8204;

	const path = `http://0.0.0.0:${modServerConfig.port}`;

	beforeEach(() => {
		server = new Server(modServerConfig)
			.configureHelmet()
			.configureKeycloakRetrival()
			.configureRoutes()
			.configureErrorHandling()
			.listen();
	});

	afterEach(() => {
		server.shutdown();
	});

	test('Should continue if Keycloak endpoint config missing', async () => {
		const response = await request(path)
			.get('')
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params);

		expect(response.statusCode).toBe(302);
	});
});
