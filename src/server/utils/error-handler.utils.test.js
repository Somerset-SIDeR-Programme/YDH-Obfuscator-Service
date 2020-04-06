const httpMocks = require('node-mocks-http');
const errorHandlerUtil = require('./error-handler.utils');

describe('Error handler utility', () => {
	test('Should return a utility function', () => {
		const util = errorHandlerUtil();
		expect(typeof util).toBe('function');
	});

	test('Should return error in response if error instance passed', () => {
		const util = errorHandlerUtil();

		const error = new Error('test');
		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		const next = jest.fn();

		util(error, req, res, next);
		// eslint-disable-next-line no-underscore-dangle
		expect(res._getData()).toBe('test');
	});

	test('Should return error in response if string passed', () => {
		const util = errorHandlerUtil();

		const error = 'test';
		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		const next = jest.fn();

		util(error, req, res, next);
		// eslint-disable-next-line no-underscore-dangle
		expect(res._getData()).toBe('test');
	});
});
