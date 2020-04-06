/**
 * @author Frazer Smith
 * @description Basic error handling utility.
 * @return {Function} Express error handler middleware.
 */
module.exports = function errorHandlerUtil() {
	// eslint-disable-next-line no-unused-vars
	return (err, req, res, next) => {
		let message;

		if (err instanceof Error) {
			message = err.message;
		} else {
			message = err;
		}
		res.send(message);
	};
};
