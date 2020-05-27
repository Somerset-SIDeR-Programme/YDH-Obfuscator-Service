const cloneDeep = require('lodash/cloneDeep');
const request = require('superagent');
const { serverConfig, loggerConfig } = require('../config');
const Server = require('./server');

serverConfig.redirectUrl = 'https://pyrusapps.blackpear.com/esp/#!/launch?';

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
	describe('Redirects', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.port = 8225;
		let server;

		const path = `http://0.0.0.0:${modServerConfig.port}`;

		beforeEach(() => {
			server = new Server(modServerConfig)
				.configureHelmet()
				.configureLogging(loggerConfig)
				.configureKeycloakRetrival()
				.configureRoutes()
				.configureErrorHandling()
				.listen();
		});

		afterEach(() => {
			server.shutdown();
		});

		test("Should redirect to Black Pear's ESP with all params present", async () => {
			const res = await request
				.get(path)
				.set('Content-Type', 'application/json')
				.set('cache-control', 'no-cache')
				.query(params);

			expect(res.redirects[0]).toMatch(
				'https://pyrusapps.blackpear.com/esp/#!/launch?'
			);
			expect(res.statusCode).toBe(200);
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
					await request
						.get(path)
						.set('Content-Type', 'application/json')
						.set('cache-control', 'no-cache')
						.query(scrubbedParams)
						.catch((err) => {
							expect(err.status).toBe(400);
						});
				})
			);
		});
	});

	describe('Keycloak token retrival', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.port = 8226;
		let server;

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

		test('Should continue when Keycloak endpoint config missing', async () => {
			const res = await request
				.get(path)
				.set('Content-Type', 'application/json')
				.set('cache-control', 'no-cache')
				.query(params);

			expect(res.redirects[0]).toMatch(
				'https://pyrusapps.blackpear.com/esp/#!/launch?'
			);
			expect(res.statusCode).toBe(200);
		});
	});

	describe('HTTPs connection with cert and key', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.https = true;
		modServerConfig.port = 8227;
		modServerConfig.ssl.cert = `${process.cwd()}/test_ssl_cert/server.cert`;
		modServerConfig.ssl.key = `${process.cwd()}/test_ssl_cert/server.key`;
		let server;

		const path = `https://0.0.0.0:${modServerConfig.port}`;

		beforeEach(() => {
			// Stand up server
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

		test('GET - Should make a successful connection', async () => {
			const res = await request
				.get(path)
				.set('Content-Type', 'application/json')
				.set('cache-control', 'no-cache')
				.query(params)
				.disableTLSCerts()
				.trustLocalhost();

			expect(res.statusCode).toBe(200);
		});
	});

	describe('HTTPs connection with PFX file and passphrase', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.https = true;
		modServerConfig.port = 8228;
		modServerConfig.ssl.pfx.pfx = `${process.cwd()}/test_ssl_cert/server.pfx`;
		modServerConfig.ssl.pfx.passphrase = 'test';
		let server;

		const path = `https://0.0.0.0:${modServerConfig.port}`;

		beforeEach(() => {
			// Stand up server
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

		test('GET - Should make a successful connection', async () => {
			const res = await request
				.get(path)
				.set('Content-Type', 'application/json')
				.set('cache-control', 'no-cache')
				.query(params)
				.disableTLSCerts()
				.trustLocalhost();

			expect(res.statusCode).toBe(200);
		});
	});
});
