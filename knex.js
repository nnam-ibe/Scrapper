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
const uuidv1 = require('uuid/v1');


module.exports = {
	getItems: () => {
		logger.log('Getting Items');
		return knex.select().table('items');
	},

	saveItems: (items) => {
		if (!items || items.length <= 0) {
			logger.log(`Nothing to save`);
			return;
		}

		logger.log(`Saving ${items.length} Items`);
		items = items.map((itemRecord) => {
			if (!itemRecord.id) itemRecord.id = uuidv1();

			return itemRecord;
		});
		return knex('items').insert(items);
	},

	getPrices: () => {
		logger.log('Getting Prices');
		return knex.select().table('prices');
	},

	savePrices: (prices) => {
		if (!prices || prices.length <= 0) {
			logger.log(`Nothing to save`);
			return;
		}

		logger.log(`Saving ${prices.length} Prices`);
		prices = prices.map((priceReord) => {
			if (!priceReord.pid) priceReord.pid = uuidv1();

			return priceReord;
		});
		return knex('prices').insert(prices);
	}
};