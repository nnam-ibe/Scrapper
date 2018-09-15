const rp = require('request-promise');
const cheerio = require('cheerio');
let logger = require('./logger.js').file('scrapper.js');

module.exports = {
	getPrice: (params) => {
		let option = {
			uri: params.uri,
			transform: (body) => cheerio.load(body)
		};

		return rp(option)
			.then(($) => {
				logger.log(`Gotten data from ${params.uri}`);
				const text = $(params.target, params.context).text();
				return text;
			})
			.catch(logger.error.bind(logger))
	}
};