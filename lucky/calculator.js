const calculator = {
	sum: function (args) {
		const add = (a , b) => a + b;

		const not = f => (...params) => !f(...params);

		return args
			.map(Number)
			.filter(not(isNaN))
			.reduce(add, 0);
	},
	average: function (args) {
		var getNbParameters = (args) => args.length;
	}
}

function makeSum(args) {
	const add = (a , b) => a + b;

	const not = f => (...params) => !f(...params);

	return args
		.map(Number)
		.filter(not(isNaN))
		.reduce(add, 0);
}

module.exports = calculator;