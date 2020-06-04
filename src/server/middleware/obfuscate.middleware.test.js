const cloneDeep = require('lodash/cloneDeep');
const faker = require('faker/locale/en_GB');
const httpMocks = require('node-mocks-http');
const Middleware = require('./obfuscate.middleware');
const { serverConfig } = require('../../config');

const args = {
	birthdate: faker.date.past().toISOString().split('T')[0],
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	patient: `https://fhir.nhs.uk/Id/nhs-number|${faker.random.number(10)}`,
	practitioner: `https://sider.nhs.uk/auth|${faker.fake(
		'{{name.lastName}}.{{name.firstName}}'
	)}@ydh.nhs.uk`,
	TPAGID: faker.random.uuid(),
	FromIconProfile: faker.random.number(),
	NOUNLOCK: faker.random.number()
};

describe('Obfuscation and serialisation middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = Middleware();

		expect(typeof middleware).toBe('function');
	});

	test('Should obfuscate patient and birthdate parameters with config.requiredProperties provided as object', () => {
		const modServerConfig = cloneDeep(serverConfig);
		modServerConfig.obfuscation.requiredProperties = {
			birthdate: '1',
			location: '1',
			patient: '1',
			practitioner: '1'
		};
		const middleware = Middleware(
			modServerConfig.obfuscation,
			modServerConfig.obfuscation.requiredProperties
		);
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(req.query.patient).toBeUndefined();
		expect(req.query.birthdate).toBeUndefined();
		expect(typeof req.query.enc).toBe('string');
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should obfuscate patient and birthdate parameters with requiredProperties provided as array', () => {
		const middleware = Middleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties
		);
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(req.query.patient).toBeUndefined();
		expect(req.query.birthdate).toBeUndefined();
		expect(typeof req.query.enc).toBe('string');
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0]).toBeUndefined();
	});

	test('Should return 400 client error when an essential parameter is missing', () => {
		const middleware = Middleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties
		);
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		delete req.query.patient;
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(res.statusCode).toBe(400);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'An essential parameter is missing'
		);
	});

	test('Should return 400 client error when query string missing', () => {
		const middleware = Middleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties
		);
		const req = httpMocks.createRequest({
			method: 'GET'
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(res.statusCode).toBe(400);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Query string missing from request'
		);
	});

	test('Should return 500 server error when required config values are missing', () => {
		const middleware = Middleware();
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		delete req.query.patient;
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(res.statusCode).toBe(500);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe('Error: options undefined');
	});

	test('Should return 500 server error when requiredProperties argument is an incorrect type', () => {
		const middleware = Middleware(serverConfig.obfuscation, 'test');
		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);

		expect(res.statusCode).toBe(500);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'List of required query keys not passed to server middleware in correct type'
		);
	});
});
