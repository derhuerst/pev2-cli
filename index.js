'use strict'

const {join: pathJoin} = require('path')
const {readFileSync} = require('fs')
const serveStatic = require('serve-static')
const {createServer} = require('http')
const accepts = require('accepts')
const finalhandler = require('finalhandler')
const {promisify} = require('util')

const DIR = pathJoin(__dirname, 'lib')

const INJECT = readFileSync(pathJoin(__dirname, 'inject.js'), {encoding: 'utf8'})
const RAW_INDEX = readFileSync(pathJoin(DIR, 'index.html'), {encoding: 'utf8'})
const INDEX = RAW_INDEX.replace('</body>', `<script>${INJECT}</script></body>`)

const visualizeExplainFile = async (explainResult, query) => {
	const pev2 = serveStatic(DIR, {
		fallthrough: false,
	})
	const app = createServer((req, res) => {
		const path = new URL(req.url, 'http://example.org').pathname
		if (path === '/') {
			res.setHeader('content-type', 'text/html')
			res.end(INDEX)
		} else if (path === '/data' && accepts(req).type(['json']) === 'json') {
			res.setHeader('content-type', 'application/json')
			res.end(JSON.stringify({explainResult, query}))
		} else {
			pev2(req, res, finalhandler(req, res))
		}
	})

	const port = 3000 // todo: pick port properly
	await promisify(app.listen.bind(app))(port)
	const stop = async () => {
		await promisify(app.close.bind(app))()
	}

	const url = new URL('http://localhost')
	url.host = app.address().address
	url.port = port
	return {
		stop,
		url: url.href,
	}
}

module.exports = visualizeExplainFile
