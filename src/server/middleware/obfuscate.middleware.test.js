const httpMocks = require('node-mocks-http');
const obfuscateMiddleware = require('./obfuscate.middleware');
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
		const middleware = obfuscateMiddleware();
		expect(typeof middleware).toBe('function');
	});

	test('Should obfuscate patient and birthdate parameters with config.requiredProperties provided as object', () => {
		const middleware = obfuscateMiddleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties.query
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
		expect(next).toHaveBeenCalledTimes(1);
		expect(typeof req.query.patient).toBe('undefined');
		expect(typeof req.query.birthdate).toBe('undefined');
		expect(typeof req.query.enc).toBe('string');
	});

	test('Should obfuscate patient and birthdate parameters with requiredProperties provided as array', () => {
		const arrayServerConfig = { ...serverConfig };
		const requiredProperties = [
			'patient',
			'birthdate',
			'location',
			'practitioner'
		];
		const middleware = obfuscateMiddleware(
			arrayServerConfig.obfuscation,
			requiredProperties
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
		expect(next).toHaveBeenCalledTimes(1);
		expect(typeof req.query.patient).toBe('undefined');
		expect(typeof req.query.birthdate).toBe('undefined');
		expect(typeof req.query.enc).toBe('string');
	});

	test('Should return 400 client error if an essential parameter is missing', () => {
		const middleware = obfuscateMiddleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties.query
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
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'An essential parameter is missing'
		);
		expect(res.statusCode).toBe(400);
	});

	test('Should return 400 client error if query string missing', () => {
		const middleware = obfuscateMiddleware(
			serverConfig.obfuscation,
			serverConfig.obfuscation.requiredProperties.query
		);

		const req = httpMocks.createRequest({
			method: 'GET',
			baseUrl: url,
			originalUrl: url
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'Query string missing from request'
		);
		expect(res.statusCode).toBe(400);
	});

	test('Should return 500 server error if required config values are missing', () => {
		const middleware = obfuscateMiddleware();

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
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe('Error: options undefined');
		expect(res.statusCode).toBe(500);
	});

	test('Should return 500 server error if requiredProperties argument incorrect type', () => {
		const middleware = obfuscateMiddleware(
			serverConfig.obfuscation,
			'test'
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
		expect(next).toHaveBeenCalledTimes(1);
		expect(next.mock.calls[0][0].message).toBe(
			'List of required query keys not passed to server middleware in correct type'
		);
		expect(res.statusCode).toBe(500);
	});
});
