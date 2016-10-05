const db = require('./data/db.json').cities
const { keys, groupBy, shuffle, random, sample, sampleSize } = require('lodash')
const continents = keys(groupBy(db, 'continent'))

// true / false generators

function isCapitalOfCountry () {
	const [ truth, lie ] = sampleSize(db, 2)
	let answer = true
	let country = truth.country
	if (!random(1)) {
		answer = false
		country = lie.country
	}

	return {
		q: `Is ${truth.city} the capital of ${country}?`,
		a: answer
	}
}

function isCityInContinent () {
	const [ truth, lie ] = sampleSize(db, 2)
	let answer = true
	let continent = truth.continent
	if (!random(1)) {
		answer = false
		continent = lie.continent
	}
	if (truth.continent === continent) answer = true

	return {
		q: `Is ${truth.city} in ${continent}?`,
		a: answer
	}
}

function isCountryInContinent () {
	const [ truth, lie ] = sampleSize(db, 2)
	let answer = true
	let continent = truth.continent
	if (!random(1)) {
		answer = false
		continent = lie.continent
	}
	if (truth.continent === continent) answer = true

	return {
		q: `Is ${truth.country} in ${continent}?`,
		a: answer
	}
}

// 4 choices

function whichCapitalOfCountry () {
	const cities = sampleSize(db, 4)
	const choices = cities.map(c => c.city)

	return {
		q: `Which city is the capital of ${cities[0].country}?`,
		cs: shuffle(choices),
		a: cities[0].city
	}
}

function whichContinent () {
	const city = sample(db)
	const choices = [city.continent].concat(sampleSize(continents.filter(c => c !== city.continent), 3))

	return {
		q: `In which continent is ${city.city}?`,
		cs: shuffle(choices),
		a: city.continent
	}
}

const generators = [
	isCapitalOfCountry,
	isCityInContinent,
	isCountryInContinent,
	whichCapitalOfCountry,
	whichContinent
];

function getQuestion () {
	return sample(generators)();
}

module.exports = getQuestion;