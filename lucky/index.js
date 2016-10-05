const { sum } = require("./calculator");
const { unary } = require("lodash");
const async = require("async");
const fs = require('fs');

const daltons = ['joe', 'william', 'averelle', 'jack'];
const files = daltons.map(d => d + ".dalton");

async.map(files, fs.readFile, (err, res) => {
	console.log(sum(res));
});

// Promisify for function => use blueBirdJs

const promises = files.map(f => {
	function executor (resolve, reject) {
		fs.readFile(f, function (err, res) {
			if (err)
				reject(err);
			resolve(res);
		});
	};

	return new Promise(executor);
})

Promise.all(promises)
.then(([joe, jack, william, averelle]) => {
	console.log(sum([joe, jack, william, averelle]));
})



//const content = daltons.map((d) => {
//	let c = fs.readFile(d + ".dalton", (err, content));
//	console.log(c);
//	return c;
//})
//console.log(content);
//console.log(calculator.sum(content));