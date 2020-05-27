/* eslint-disable no-underscore-dangle */
const faker = require('faker/locale/en_GB');
const httpMocks = require('node-mocks-http');
const Util = require('./error-handler.utils');

describe('Error handler utility', () => {
	test('Should return a utility function', () => {
		const util = Util();
		expect(typeof util).toBe('function');
	});

	test('Should return error in response when error instance passed', () => {
		const util = Util();
		const randomString = faker.lorem.sentence();
		const error = new Error(randomString);
		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		const next = jest.fn();

		util(error, req, res, next);

		expect(res._getData()).toBe(randomString);
	});

	test('Should return error in response when string passed', () => {
		const util = Util();
		const error = faker.lorem.sentence();
		const req = httpMocks.createRequest();
		const res = httpMocks.createResponse();
		const next = jest.fn();

		util(error, req, res, next);

		expect(res._getData()).toBe(error);
	});
});
