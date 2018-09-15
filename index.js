const scrapper = require('./scrapper.js');
const knex = require('./knex.js');
const logger = require('./logger.js').file('index.js');

knex.getItems()
	.then(getActiveItem)
	.then(mapItems)
	.then(savePrices)
	.catch(logger.error.bind(logger))
	.then(process.exit);

function getActiveItem(items) {
	if (!items || items.length <= 0) return [];

	return items.filter((item) => item.active);
}

function mapItems(items) {
	let mappedItems = items.map((item) => getItemPrice(item));
	return Promise.all(mappedItems);
}

function getItemPrice(item) {
	return scrapper.getPrice(item)
		.then(_getNumericValue)
		.then((price) => {
			if (!price) return null;

			item.price = price;
			return item;
		})
}

function savePrices(items) {
	let prices = items.reduce((acc, item) => {
		if (!item) return acc;

		acc.push({
			item_id: item.id,
			price: item.price,
			date: new Date()
		});

		return acc;
	}, []);

	return knex.savePrices(prices);
}

function _getNumericValue(price) {
	if (!price) return null;

	price = price.replace(/[^0-9]/g, '');
	return Number(price);
}