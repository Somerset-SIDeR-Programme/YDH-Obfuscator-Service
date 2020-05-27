const cloneDeep = require('lodash/cloneDeep');
const httpMocks = require('node-mocks-http');
const Middleware = require('./obfuscate.middleware');
const { serverConfig } = require('../../config');

const args = {
	patient: 'https://fhir.nhs.uk/Id/nhs-number|9467335646',
	birthdate: '1932-04-15',
	location: 'https://fhir.nhs.uk/Id/ods-organization-code|RA4',
	practitioner: 'https://sider.nhs.uk/auth|frazer.smith@ydh.nhs.uk',
	TPAGID: 'M5',
	FromIconProfile: 13,
	NOUNLOCK: 1
};

const url =
	'http://127.0.0.1:8204/?patient=https%3A%2F%2Ffhir.nhs.uk%2FId%2Fnhs-number%7C9468172546&birthdate=1991-03-29&location=https%3A%2F%2Ffhir.nhs.uk%2FId%2Fods-organization-code%7CRA4&practitioner=https%3A%2F%2Fsider.nhs.uk%2Fauth%7Cfrazer.smith%40ydh.nhs.uk';

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
			query: Object.assign(query, args),
			baseUrl: url,
			originalUrl: url
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
			query: Object.assign(query, args),
			baseUrl: url,
			originalUrl: url
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
			query: Object.assign(query, args),
			baseUrl: url,
			originalUrl: url
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
			method: 'GET',
			baseUrl: url,
			originalUrl: url
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
			query: Object.assign(query, args),
			baseUrl: url,
			originalUrl: url
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
			query: Object.assign(query, args),
			baseUrl: url,
			originalUrl: url
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
