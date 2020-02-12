const httpMocks = require('node-mocks-http');
const sanitizeMiddleware = require('./sanitize.middleware');

const args = {
	argString: 'hello',
	argNumber: '2',
	argObject: { test1: 1, test2: 2 },
	argBoolean: 'true',
	argJson: '{ "test1": 1, "test2": 2 }',
	argDefault: 'default',
	argInvalid: "i'm not valid"
};

const requiredArgs = {
	argString: 'string',
	argNumber: 'number',
	argObject: 'object',
	argBoolean: 'boolean',
	argJson: 'json',
	argDefault: 'default'
};

describe('Sanitization and validation middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = sanitizeMiddleware();
		expect(typeof middleware).toBe('function');
	});

	test('Should continue if no required arguments are provided', () => {
		const middleware = sanitizeMiddleware();

		const req = {};
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should parse GET query values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'GET',
			query: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.query.argInvalid;

		middleware(req, res, next);
		expect(typeof req.query.argString).toBe('string');
		expect(typeof req.query.argNumber).toBe('number');
		expect(typeof req.query.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should return 400 client error if invalid GET query values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'GET',
			query: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(res.statusCode).toBe(400);
	});

	test('Should parse params values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'GET',
			params: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argInvalid;

		middleware(req, res, next);
		expect(typeof req.params.argString).toBe('string');
		expect(typeof req.params.argNumber).toBe('number');
		expect(typeof req.params.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should return 400 client error if invalid param values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'GET',
			params: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(res.statusCode).toBe(400);
	});

	test('Should parse PUT body values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'PUT',
			body: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.body.argInvalid;

		middleware(req, res, next);
		expect(typeof req.body.argString).toBe('string');
		expect(typeof req.body.argNumber).toBe('number');
		expect(typeof req.body.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should return 400 client error if invalid PUT body values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = {
			method: 'PUT',
			body: Object.assign(query, args)
		};
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(res.statusCode).toBe(400);
	});
});
