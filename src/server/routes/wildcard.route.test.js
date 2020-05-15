const cloneDeep = require('lodash/cloneDeep');
const request = require('superagent');
const { serverConfig } = require('../../config');
const Server = require('../server');

serverConfig.https = false;

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

describe('Wildcard Route', () => {
	let server;

	afterEach(() => {
		server.shutdown();
	});

	test('Should return 500 error response if routing config missing', async () => {
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
