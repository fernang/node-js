// in memory for now
const db = {
	users: {},
	scores: {}
}

app.get('/signup', isNotAuthenticated, (req, res) => {
	res.render('users/form', {
		title: 'Signup'
	})
})

app.post('/signup', isNotAuthenticated, (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  const ERR_REDIRECT = new Error()

  ;((username && password) ? Promise.resolve() : Promise.reject(ERR_REDIRECT))
  .then(storeUser(username, password, ERR_REDIRECT))
  .then(updateSession(req.session, username))
  .then(updateScore(username))
  .then(() => res.redirect('/questions/random'))
  .catch((e) => {
    if (e === ERR_REDIRECT) {
      res.redirect('/signup')
    } else {
      next(e)
    }
  })
})

app.get('/signin', isNotAuthenticated, (req, res) => {
	res.render('users/form', {
		title: 'Signin'
	})
})

app.post('/signin', isNotAuthenticated, (req, res, next) => {
	const username = req.body.username
	const password = req.body.password
	Promise.resolve(db.users[username])
	.then((pwd) => {
		if (password === pwd){
			req.session.username = username
			res.redirect('/question/random')
		} else {
			res.redirect('/login')
		}
	}).catch(next)
})

app.get('/signout', (req, res) => {
	req.session.username = null
	res.redirect('/signin')
})

function storeUser (username, password, errIfFail) {
	return function () {
		return new Promise((resolve, reject) => {
			// exists already
			if (db.users[username]) reject(errIfFail)

			db.users[username] = password
			resolve(username)
		})
	}
}

function updateScore (username) {
	return function () {
		db.scores[username] = 0
		return Promise.resolve()
	}
}

function updateSession (session, username) {
	return function (data) {
		session.username = username
		return data
	}
}

function isAuthenticated (req, res, next) {
	if (!req.session.username) {
		res.redirect('/')
	} else {
		next()
	}
}

function isNotAuthenticated (req, res, next) {
	if (req.session.username) {
		res.redirect('/')
	} else {
		next()
	}
}