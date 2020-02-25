const httpMocks = require('node-mocks-http');
const sanitizeMiddleware = require('./sanitize.middleware');

const args = {
	argString: 'hello',
	argNumber: 2,
	argNumberString: '2',
	argObject: { test1: 1, test2: 2 },
	argBoolean: true,
	argBooleanString: 'true',
	argDate: '2020-04-24',
	argJson: '{ "test1": 1, "test2": 2 }',
	argInvalid: "i'm not valid"
};

const requiredArgs = {
	argString: { type: 'string', mandatory: false },
	argNumber: { type: 'number', mandatory: false },
	argNumberString: { type: 'number', mandatory: false },
	argObject: { type: 'object', mandatory: false },
	argBoolean: { type: 'boolean', mandatory: false },
	argBooleanString: { type: 'boolean', mandatory: false },
	argDate: { type: 'date', mandatory: false },
	argJson: { type: 'json', mandatory: false }
};

describe('Sanitization and validation middleware', () => {
	test('Should return a middleware function', () => {
		const middleware = sanitizeMiddleware();
		expect(typeof middleware).toBe('function');
	});

	test('Should continue if no required arguments are provided', () => {
		const middleware = sanitizeMiddleware();

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(typeof req.query.argString).toBe('string');
		expect(typeof req.query.argNumber).toBe('number');
		expect(typeof req.query.argNumberString).toBe('number');
		expect(typeof req.query.argBoolean).toBe('boolean');
		expect(typeof req.query.argBooleanString).toBe('boolean');
		expect(typeof req.query.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should parse GET query values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.query.argInvalid;

		middleware(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(typeof req.query.argString).toBe('string');
		expect(typeof req.query.argNumber).toBe('number');
		expect(typeof req.query.argNumberString).toBe('number');
		expect(typeof req.query.argBoolean).toBe('boolean');
		expect(typeof req.query.argBooleanString).toBe('boolean');
		expect(typeof req.query.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should pass an error to next if invalid GET query values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			query: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next.mock.calls[0][0]).toBe(
			'Invalid option provided: argInvalid'
		);
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should parse params values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argInvalid;

		middleware(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(typeof req.params.argString).toBe('string');
		expect(typeof req.params.argNumber).toBe('number');
		expect(typeof req.params.argNumberString).toBe('number');
		expect(typeof req.params.argBoolean).toBe('boolean');
		expect(typeof req.params.argBooleanString).toBe('boolean');
		expect(typeof req.params.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should pass an error to next if invalid param values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next.mock.calls[0][0]).toBe(
			'Invalid option provided: argInvalid'
		);
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should parse PUT body values if all arguments are valid', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'PUT',
			body: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.body.argInvalid;

		middleware(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(typeof req.body.argString).toBe('string');
		expect(typeof req.body.argNumber).toBe('number');
		expect(typeof req.body.argNumberString).toBe('number');
		expect(typeof req.body.argBoolean).toBe('boolean');
		expect(typeof req.body.argBooleanString).toBe('boolean');
		expect(typeof req.body.argObject).toBe('object');
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should pass an error to next if invalid PUT body values are provided', () => {
		const middleware = sanitizeMiddleware(requiredArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'PUT',
			body: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();

		middleware(req, res, next);
		expect(next.mock.calls[0][0]).toBe(
			'Invalid option provided: argInvalid'
		);
		expect(next).toHaveBeenCalledTimes(1);
	});

	test('Should pass an error to next if mandatory value is missing', () => {
		const adjustedArgs = {};
		Object.assign(adjustedArgs, requiredArgs);
		adjustedArgs.argString.mandatory = true;

		const middleware = sanitizeMiddleware(adjustedArgs);

		const query = {};
		const req = httpMocks.createRequest({
			method: 'GET',
			params: Object.assign(query, args)
		});
		const res = httpMocks.createResponse();
		const next = jest.fn();
		delete req.params.argString;

		middleware(req, res, next);
		expect(next.mock.calls[0][0]).toBe(
			'A mandatory parameter is missing from the list: argString'
		);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
