const cloneDeep = require('lodash/cloneDeep');
const faker = require('faker/locale/en_GB');
const request = require('superagent');
const { serverConfig } = require('../../config');
const Server = require('../server');

serverConfig.https = false;

const params = {
	birthdate: faker.date.past().toISOString().split('T')[0],
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	patient: `https://fhir.nhs.uk/Id/nhs-number|${faker.random.number(10)}`,
	practitioner: `https://sider.nhs.uk/auth|${faker.fake("{{name.lastName}}.{{name.firstName}}")}@ydh.nhs.uk`,
	TPAGID: faker.random.uuid(),
	FromIconProfile: faker.random.number(),
	NOUNLOCK: faker.random.number()
};

describe('Wildcard Route', () => {
	let server;

	afterEach(() => {
		server.shutdown();
	});

	test('Should return 500 error response when routing config missing', async () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.port = 8315;
		const path = `http://0.0.0.0:${modServerConfig.port}`;
		delete modServerConfig.redirectUrl;

		// Stand up server
		server = new Server(modServerConfig)
			.configureHelmet()
			.configureKeycloakRetrival()
			.configureRoutes()
			.configureErrorHandling()
			.listen();

		await request
			.get(path)
			.set('Content-Type', 'application/json')
			.set('cache-control', 'no-cache')
			.query(params)
			.catch((err) => {
				expect(err.status).toBe(500);
				expect(err.response.error.text).toMatch(
					'recieving endpoint missing'
				);
			});
	});
});
