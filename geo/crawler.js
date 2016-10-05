const fs = require('fs')
const { dirname } = require('path')
const got = require('got')
const mkdirp = require('mkdirp')
const sanitize = require('sanitize-filename')
const cheerio = require('cheerio');
const lodash = require('lodash');

const urls = [
	'https://en.wikipedia.org/wiki/List_of_national_capitals_by_population',
	'https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent'
]

const CACHE_DIR = 'cache';

function getContent (url) {
	return getContentFromCache(url)
		.catch(err => getContentFromWeb(url));
}

function getContentFromCache(url) {
	return new Promise((resolve, reject) => {
		fs.readFile(getCacheName(url), 'utf8', (err, contents) => {
			if (err)
				reject(err);

			resolve(contents);
		});
	})
}

function getContentFromWeb (url) {
	console.log('from web');

	return got(url)
		.then(res => res.body)
		.then(setCache(url));
}

function setCache (url) {
	return (contents) => writeFile(getCacheName(url), contents)
}

function writeFile (name, contents) {
	return new Promise((resolve, reject) => {
		mkdirp(dirname(name), (err) => {
			if (err) reject(err)

			fs.writeFile(name, contents, (err) => {
				err ? reject(err) : resolve(contents)
			})
		})
	})
}

function getCacheName (url) {
	const filename = sanitize(url);

	return `${CACHE_DIR}/${filename}`;
}

// Parse

function clean (str) {
	return str.split('(')[0].split('[')[0].trim()
}

function parse0 (body) {
	function cleanPop (pop) {
		return Number(pop.split('♠')[1].split('[')[0].replace(/,/g, ''))
	}

	let $ = cheerio.load(body);

	const raw = $('.wikitable tr').slice(1).map((i, tr) => {
		return parseTr($, tr);
	}).get();

	return raw.map(([ rank, country, city, pop ]) => {
		return { country: clean(country), city: clean(city), pop: cleanPop(pop) };
	});
}

function parse1 (contents) {
	const $ = cheerio.load(contents)

	const continents = $('h2 .mw-headline').slice(0, 7).map((i, h2) => $(h2).text()).get()

	const raw = $('.wikitable').map((i, table) => {
		return [ $(table).find('tr').slice(1).map((i, tr) => {
			return parseTr($, tr)
		}).get() ]
	}).get()

	// flatMap
	const result = raw.reduce((acc, continent, i) => {
		return acc.concat(continent.map(([ flag, country, city ]) => {
			return { country: clean(country), city: clean(city), continent: continents[i] }
		}))
	}, [])

	return result
}

function parseTr ($, tr) {
	return [ $(tr).find('td').map((i, td) => $(td).text()).get() ];
}

function reduceByCity (arr) {
	return arr.reduce((acc, item) => {
		acc[item.city] = item;
		return acc;
	}, {});
}

// Promise All

Promise.all([
	getContent(urls[0]).then(parse0).then(reduceByCity),
	getContent(urls[1]).then(parse1).then(reduceByCity)
]).then(([byPop, byContinent]) => {
	const result = lodash.intersection(Object.keys(byPop),
		Object.keys(byContinent)).map(country => {
		return Object.assign({}, byPop[country], byContinent[country])
	})

	return result;
})
.then(res => writeFile('data/db.json', JSON.stringify({ cities: res}, null, 2)))