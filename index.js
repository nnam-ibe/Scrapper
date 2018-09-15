const scrapper = require('./scrapper.js');
const knex = require('./knex.js');
const logger = require('./logger.js').file('index.js');

knex.getItems()
	.then(mapItems)
	.then(savePrices)
	.catch(logger.error)
	.then(process.exit);

function mapItems(items) {
	if (!items || items.length <= 0) throw new Error('Empty Array');

	let mappedItems = items.map((item) => getItemPrice(item));
	return Promise.all(mappedItems);
}

function getItemPrice(item) {
	return scrapper.getPrice(item)
		.then(_getNumericValue)
		.then((price) => {
			item.price = price;
			return item;
		})
}

function savePrices(items) {
	let prices = items.map((item) => {
		return {
			item_id: item.id,
			price: item.price,
			date: new Date()
		};
	});

	return knex.savePrices(prices);
}

function _getNumericValue(price) {
	price = price.replace(/[^0-9]/g, '');
	return Number(price);
}