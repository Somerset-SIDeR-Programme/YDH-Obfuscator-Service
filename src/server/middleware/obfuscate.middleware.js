const { obfuscate } = require('obfuscated-querystring/lib');

/**
 * @description Serialises a query object into a URI encoded string.
 * @param {Object} obj - Request query object.
 * @returns {String} URI encoded string.
 */
function serialise(obj) {
  const str = [];
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      str.push(
        value !== null && typeof value === 'object'
          ? serialise(value, key)
          : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    }
  });
  return str.join('&');
}

/**
 * @author Frazer Smith
 * @description Obfuscates and serialises request parameter keys and values.
 * @param {Object} config - Obfuscation values.
 * @param {Object} config.encryptionKey
 * @param {String} config.encryptionKey.name - Encryption key name.
 * @param {String} config.encryptionKey.value - Encryption key value.
 * @param {Array} config.obfuscate - Parameters that should be obfuscated.
 * @param {Array} config.requiredParams - Parameters that are essential and needed for requesting.
 * @return {Function} express middleware.
 */
module.exports = function serialiseObfuscateMiddleware(config) {
  return (req, res, next) => {
    // Retrieve all param keys from query and check all essential ones are present
    const keys = Object.keys(req.query);

    try {
      // eslint-disable-next-line max-len
      if (config.requiredParams.every((element) => keys.map((x) => x.toLowerCase()).includes(element.toLowerCase()))) {
        const obfuscatedParams = obfuscate(serialise(req.query), config);
        // eslint-disable-next-line no-underscore-dangle
        req._parsedUrl.query = obfuscatedParams;
        next();
      } else {
        res.status(400).send('An essential parameter is missing');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  };
};
