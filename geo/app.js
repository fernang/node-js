const express = require('express');
const path = require('path');
const pug = require('pug');
var bodyParser = require('body-parser')
var session = require('express-session');

const authRouter = require('./lib/route/auth')
const getQuestion = require('./question-generators');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.set('x-powered-by', false);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'ses',
	name: 'geoquizzId',
	resave: false,
	saveUninitialized: false
}));

app.locals.title = 'GeoQuizz';

app.use((req, res, next) => {
	if (req.session.login)
		app.locals.login = req.session.login

	next()
})

app.get('/', (req, res) => {
	res.render('index');
});

let question;
let validate;

app.get('/question', authRouter.isAuthenticated, (req, res) => {
	req.session.question = getQuestion()
	question = getQuestion();
	req.session.validate = null;

	res.render('question', {
	 	question: req.session.question,
	 	validate: req.session.validate
	});
});

app.post('/question', authRouter.isAuthenticated, (req, res) => {
	if (req.session.question.cs) {
		req.session.validate = req.body.response === req.session.question.a
	} else {
		let bool = req.body.response === "true"
		req.session.validate = bool === req.session.question.a
	}
	res.redirect('/question');
});

app.use((err, req, res, next) => {
	console.error('oops', err)
	res.send(500)
})

authRouter(app)
 
module.exports = app;