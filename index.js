import {join as pathJoin} from 'node:path'
import {readFileSync} from 'node:fs'
import {createServer} from 'node:http'
import accepts from 'accepts'
import {promisify} from 'node:util'

const INJECT = readFileSync(
	pathJoin(import.meta.dirname, '/inject.js'),
	{encoding: 'utf8'},
)
const RAW_INDEX = readFileSync(
	pathJoin(import.meta.dirname, 'lib/index.html'),
	{encoding: 'utf8'},
)
const INDEX = RAW_INDEX.replace('</body>', `<script>${INJECT}</script></body>`)

const visualizeExplainFile = async (explainResult, query, opt = {}) => {
	const {
		once,
		name,
	} = {
		once: false,
		name: 'new-plan',
		...opt,
	}

	const app = createServer((req, res) => {
		if (once) res.setHeader('connection', 'close')

		const path = new URL(req.url, 'http://example.org').pathname
		if (path === '/') {
			res.setHeader('content-type', 'text/html')
			res.end(INDEX)
		} else if (path === '/data' && accepts(req).type(['json']) === 'json') {
			if (once) {
				res.once('finish', () => {
					// Ugly but effective way to make sure all resources have
					// been fetched by the client.
					setTimeout(() => {
						stop().catch(console.error)
					}, 1000)
				})
			}

			res.setHeader('content-type', 'application/json')
			res.end(JSON.stringify({name, explainResult, query}))
		} else {
			res.writeHead(404)
			res.end()
		}
	})

	const port = 10000 + (Math.random() * 10000 | 0) // todo: pick port properly
	const listen = promisify(app.listen.bind(app))
	await listen({
		host: 'localhost',
		port,
	})
	const stop = async () => {
		await promisify(app.close.bind(app))()
	}

	const url = new URL('http://example.org')
	{
		const {family, address, port} = app.address()
		// work around https://github.com/nodejs/node/issues/49650
		url.hostname = family === 'IPv6' ? `[${address}]` : address
		url.port = port
	}
	return {
		stop,
		url: url.href,
	}
}

export {
	visualizeExplainFile,
}
