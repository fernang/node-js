const inquirer = require('inquirer');
const { partition } = require('lodash');
const chalk = require('chalk');
var getQuestion = require('./question-generators');

const NB = Number(process.argv[2]) || 5;

const questions = [...Array(NB)]
	.map(getQuestion)
	.map((q, i) => ({
		message: chalk.blue(q.q),
		type: q.cs ? 'list' : 'confirm',
		choices: q.cs,
		name: i + 1,
		answer: q.a
	}))

function checkResponse (responses) {
	console.log(responses);
	const fulls = questions.map(q => {
		q.response = responses[q.name];

		return q;
	});

	const predicate = q => q.answer === q.response;
	const [ rights, wrongs ] = partition(fulls, predicate)

	console.log('Rights:', rights.length, 'Wrongs:', wrongs.length);

	wrongs.forEach(q => {
		console.log(q.message, chalk.green(q.answer), chalk.red(q.response))
	});
}

inquirer.prompt(questions).then(checkResponse);