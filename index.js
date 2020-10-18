'use strict'

const {join: pathJoin} = require('path')
const serveStatic = require('serve-static')
const {createServer} = require('http')
const finalhandler = require('finalhandler')
const {promisify} = require('util')
const {encode: encodeQueryString} = require('querystring')

const visualizeExplainFile = async (explainResult, query) => {
	const pev2 = serveStatic(pathJoin(__dirname, 'lib'), {
		fallthrough: false,
	})
	const app = createServer((req, res) => {
		pev2(req, res, finalhandler(req, res))
	})

	const port = 3000 // todo: pick port properly
	await promisify(app.listen.bind(app))(port)
	const stop = async () => {
		await promisify(app.close.bind(app))()
	}

	// todo: make pev2 support passing via URL, see dalibo/pev2#292
	let url = new URL('http://localhost')
	url.port = port
	url.hash = encodeQueryString({
		explainResult,
		query,
	})
	url = url.href

	return {stop, url}
}

module.exports = visualizeExplainFile
