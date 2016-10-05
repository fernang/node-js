const users = {}

const authRouter = (app) => {
	app.get('/signup', (req, res) => {
		res.render('signin', { title: 'Signup' })
	})

	app.post('/signup', (req, res) => {
		const { login, password } = req.body
		if (!login || !password) {
			next({ message: 'Missing fields', redirect: '/signup'})
		}
		if (users[login]) {
			next({ message: 'Missing fields', redirect: '/signup'})
		}
		users[login] = password
		req.session.login = login
		res.redirect('/')
	})

	app.get('/signin', (req, res) => {
		res.render('signin', { title: 'Signin' })
	})

	app.post('/signin', (req, res) => {
		const { login, password } = req.body
		if (!login || !password)
			next({ message: 'Missing fields', redirect: '/signin'})
		if (!users[login]) {
			req.session.error = 'Login does not exist'
			return res.redirect('/signin')
		}
		if (users[login] !== password) 
			next({ message: 'Missing fields', redirect: '/signin'})

		req.session.login = login
		res.redirect('/')
	})


	app.get('/signout', (req, res) => {
		req.session.user = null
		res.redirect('/')
	})

	app.use((err, req, res, next) => {
		req.session.error = err.message
		return res.redirect(err.redirect)
	})
}

authRouter.isAuthenticated = (req, res, next) => {
	if (!req.session.login) {
		req.session.error = "Not authenticated"
		res.redirect('/signin')
	} else {
		// ok
		next()
	}
}

module.exports = authRouter