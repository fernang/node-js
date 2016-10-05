document.addEventListener('DOMContentLoaded', () => {
	const socket = io()

	// elements
	const elements = {
		q: document.querySelector('.q'),
		form: document.querySelector('form'),
		actions: document.querySelector('.actions'),
		score: document.querySelector('.score'),
		verdict: document.querySelector('.verdict')
	}

	// util
	const createButton = (value) => {
		const button = document.createElement('input')
		button.type = 'submit'
		button.value = value
		return button
	}

	// let the socket do the talk
	elements.form.onsubmit = (e) => e.preventDefault()

	// refresh ui
	socket.on('state', ({ question, verdict, total, points = 0 }) => {
		console.debug('↓ state', question, verdict, total, points)

		elements.q.textContent = question.q
		elements.actions.innerHTML = ''
		elements.score.textContent = `${points}/${total}`
		elements.verdict.textContent = verdict
			? 'Congrats you are right!'
			: 'Sorry you are wrong!'
		elements.verdict.className = `verdict ${verdict ? 'right' : 'wrong'}`

		if (question.cs) {
			question.cs.forEach(c =>
				elements.actions.appendChild(createButton(c)))
		} else {
			[true, false].forEach(c =>
				elements.actions.appendChild(createButton(c)))
		}
	})

	// event delegation for submission
	elements.actions.addEventListener('click', ({ target }) => {
		if (target.type !== 'submit') return
		socket.emit('response', target.value)
	})
})