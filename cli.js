#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    pev2 <path-to-query-file>
Notes:
    This tool will run the query using the \`psql\` command-line tool.
Options:
    -
Examples:
    pev2 path/to/some-explain-query.sql
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const execa = require('execa')
const {readFileSync} = require('fs')
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

	const {stdout: explainResult} = await execa('psql', [
		'-XqAt', // from pev2 instructions
		'-f', pathToQuery,
	])

	const {url} = await visualizeExplainFile(explainResult, query)
	process.stdout.write(url + '\n')
})()
.catch(showError)
