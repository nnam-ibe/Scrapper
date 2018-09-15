const pg = require('pg');
const logger = require('./logger.js').file('knex.js');
const knex = require('knex')({
	client: 'pg',
	connection: {
		host: process.env.PRICE_TRACKER_HOST,
		user: process.env.PRICE_TRACKER_USER,
		password: process.env.PRICE_TRACKER_PASSWORD,
		database: process.env.PRICE_TRACKER_DATABASE
	}
});


module.exports = {
	getItems: () => {
		logger.log('Getting Items');
		return knex.select().table('items');
	},

	getPrices: () => {
		logger.log('Getting Prices');
		return knex.select().table('prices');
	},

	savePrices: (prices) => {
		logger.log(`Saving ${prices.length} Prices`);
		return knex('prices').insert(prices);
	}
};