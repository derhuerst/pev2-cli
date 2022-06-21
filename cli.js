#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'open', 'o',
		'quiet', 'q',
		'once', '1',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    pev2 <path-to-query-file>
Notes:
    This tool uses the pev2 to visualize PostgreSQL's performance data.
    To obtain this data for your query, prefix it with the following line:
        EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON)

    This tool will run the query using the \`psql\` command-line tool.
Options:
    --open     -o  Open the URL in the browser.
    --quiet    -q  Don't report what's going on.
    --once     -1  Stop serving after pev2 has received the data.
Examples:
    pev2 --open -q path/to/some-explain-query.sql
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const execa = require('execa')
const {readFileSync} = require('fs')
const open = require('open')
const visualizeExplainFile = require('.')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

;(async () => {
	const pathToQuery = argv._[0]
	if (!pathToQuery) {
		showError('Missing 1st argument: path to EXPLAIN query file.')
	}
	const query = readFileSync(pathToQuery, {encoding: 'utf8'})

	const quiet = !!(argv.quiet || argv.q)
	const once = !!(argv.once || argv['1'])

	if (!quiet) console.info(`running psql with ${pathToQuery}`)
	const {stdout: explainResult} = await execa('psql', [
		'-XqAt', // from pev2 instructions
		'-v', 'ON_ERROR_STOP=1', // stop & exit non-zero on errors
		'-f', pathToQuery,
	])

	const {url} = await visualizeExplainFile(explainResult, query, {
		once,
	})
	if (!quiet) console.info(`serving pev2 at ${url}`)
	if (argv.open || argv.o) {
		await open(url)
	}
})()
.catch((err) => {
	if (err && err.command && err.command.slice(0, 5) === 'psql ') {
		err = err.stderr
	}
	showError(err)
})
