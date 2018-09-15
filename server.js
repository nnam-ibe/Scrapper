const express = require('express');
const app = express();
const port = process.env.PORT || 5555;
const scrapper = require('./scrapper.js');
const knex = require('./knex.js');
let logger = require('./logger.js').file('server.js');

app.get('/', (req, res) => res.send('Hello There!, try /api/check_price'));

app.get('/api/check_price', (req, res) => {
	logger.log(`Checking Prices @ ${req.query.uri}`);

	let params = {
		uri: req.query.uri,
		target: req.query.target,
		context: req.query.context
	};

	scrapper.getPrice(params)
		.then((result) => {
			res.send(result);
		});
});

app.get('/api/get_prices', (req, res) => {
	logger.log(`Getting Prices `);
	knex.getItems().then((result) => res.send(JSON.stringify(result, null, 2)));
});

app.listen(port, () => logger.log(`Listening on port ${port}`));
