const colors = require('colors/safe');

class Logger {
	file(name) {
		this.filename = name;
		return this;
	}

	log(message) {
		console.log(this.prefix() + '\t' + message);
	}

	error(message) {
		console.log(this.prefix() + '\t' + colors.red(message));
	}

	prefix() {
		return colors.green(this.filename) + ' ' + colors.blue(new Date());
	}
};

module.exports = new Logger();