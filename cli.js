#!/usr/bin/env node

// todo: use import assertions once they're supported by Node.js (>= 18.20.5) & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import {parseArgs} from 'node:util'
const pkg = require('./package.json')

const {
	values: flags,
	positionals: args,
} = parseArgs({
	options: {
		'help': {
			type: 'boolean',
			short: 'h',
		},
		'version': {
			type: 'boolean',
			short: 'v',
		},
		'open': {
			type: 'boolean',
			short: 'o',
		},
		'app': {
			type: 'string',
		},
		'quiet': {
			type: 'boolean',
			short: 'q',
		},
		'once': {
			type: 'boolean',
			short: '1',
		},
		'name': {
			type: 'string',
			short: 'n',
		},
	},
	allowPositionals: true,
})

if (flags.help) {
	process.stdout.write(`
Usage:
	pev2 <path-to-query-file> [path-to-execution-plan]
Notes:
	This tool uses the pev2 to visualize PostgreSQL's execution plan including
	costs associated to each operation.
		more info: https://www.postgresql.org/docs/14/using-explain.html
	To let PostgreSQL generate the plan, prefix it with the following line:
		EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON)

	If you don't pass an execution plan, this tool will spawn \`psql\` to run the
	the query. Use the \`PG*\` environment variables to make sure \`psql\` can
	connect to the right database.
		more info: https://www.postgresql.org/docs/14/libpq-envars.html
Options:
	--open     -o  Open the URL in the browser.
	--app          The browser to open the URL with.
	--quiet    -q  Don't report what's going on.
	--once     -1  Stop serving after pev2 has received the data.
	--name     -n  Give the execution plan a name within pev2.
					 Default: filename and ISO date+time
Examples:
	pev2 --open --app firefox -q path/to/some-explain-query.sql
\n`)
	process.exit(0)
}

if (flags.version) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

import {basename} from 'node:path'
import {execa} from 'execa'
import {readFileSync} from 'node:fs'
import open from 'open'
import {visualizeExplainFile} from './index.js'

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

try {
	const pathToQuery = args[0]
	if (!pathToQuery) {
		showError('Missing 1st argument: path to EXPLAIN query file.')
	}
	const query = readFileSync(pathToQuery, {encoding: 'utf8'})

	const pathToExecPlan = args[1] || null

	const quiet = !!flags.quiet
	const once = !!(flags.once || flags['1'])

	const filename = args[1] ? basename(pathToExecPlan) : basename(pathToQuery)
	const name = flags.name || `${filename} ${new Date().toISOString()}`

	let explainResult = null
	if (pathToExecPlan !== null) {
		explainResult = readFileSync(pathToExecPlan, {encoding: 'utf8'})
	} else {
		if (!quiet) console.info(`running psql with ${pathToQuery}`)
		const res = await execa('psql', [
			'-XqAt', // from pev2 instructions
			'-v', 'ON_ERROR_STOP=1', // stop & exit non-zero on errors
			'-f', pathToQuery,
		])
		explainResult = res.stdout
	}

	const {url} = await visualizeExplainFile(explainResult, query, {
		once,
		name,
	})
	if (!quiet) console.info(`serving pev2 at ${url}`)
	if (flags.open) {
		await open(url, {
			...(flags.app ? {
				app: {name: flags.app},
			} : {}),
		})
	}
} catch (err) {
	let errToUse = err
	if (err.stderr && err.command?.slice(0, 5) === 'psql ') {
		errToUse = err.stderr
	}
	showError(errToUse)
}
