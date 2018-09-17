const readline = require('readline');
const uuidv1 = require('uuid/v1');
const knex = require('./knex.js');
const logger = require('./logger.js').file('get-insert-statement.js');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

getItemDefaults()
	.then(getItemName)
	.then(getItemUri)
	.then(getTarget)
	.then(getContext)
	.then(confirmActiveItem)
	.then(generateInsertStatement)
	.then(confirmInsertion)
	.then(insertIntoDb)
	.catch(logger.error.bind(logger))
	.then(closeRl)


function getItemDefaults() {
	return Promise.resolve({
		id: uuidv1(),
		active: true
	});
}

function getItemName(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nWhat is the name of the item\n', (itemName) => {
			if (!itemName) reject('Please provide Item Name');

			item.name = itemName.trim();
			resolve(item);
		});
	});
}

function getItemUri(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nItem URI?\n', (itemUri) => {
			if (!itemUri) reject('Please provide Item URI');

			item.uri = itemUri.trim();
			resolve(item);
		});
	});
}


function getTarget(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nItem Target\n', (itemTarget) => {
			if (!itemTarget) reject('Please provide Item Target');

			item.target = itemTarget.trim();
			resolve(item);
		});
	});
}

function getContext(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nItem Context\n', (itemContext) => {
			if (!itemContext) reject('Please provide Item Context');

			item.context = itemContext.trim();
			resolve(item);
		});
	});
}

function confirmActiveItem(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nWill this item be active? (y/n)\n', (itemActive) => {
			if (!itemActive) resolve(item);

			itemActive = itemActive.trim().toLowerCase();
			if (itemActive.indexOf('n') >= 0) item.active = false;

			resolve(item);
		});
	});
}

function generateInsertStatement(item) {
	const statment = `INSERT INTO ITEMS(id, name, uri, target, context, active) values ('${item.id}', '${item.name}', '${item.uri}', '${item.target}', '${item.context}', ${item.active});`;
	console.log(statment);
	return Promise.resolve(item);
}

function confirmInsertion(item) {
	return new Promise((resolve, reject) => {
		rl.question('\nInsert into DB (y/n)\n', (answer) => {
			if (!answer) resolve(item);

			answer = answer.trim().toLowerCase();

			if (answer.indexOf('n') >= 0) reject('Not Saving');

			resolve(item);
		});
	});
}

function insertIntoDb(item) {
	if (!item) reject('Nothing to insert');

	return knex.saveItems([item]);
}

function closeRl(argument) {
	rl.close();
}