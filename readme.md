# pev2-cli

**Run the [PostgreSQL Explain Visualizer 2 (pev2)](https://github.com/dalibo/pev2) from the command line.**

[![npm version](https://img.shields.io/npm/v/pev2-cli.svg)](https://www.npmjs.com/package/pev2-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/pev2-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/pev2-cli.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me via Matrix](https://img.shields.io/badge/chat%20with%20me-via%20Matrix-000000.svg)](https://matrix.to/#/@derhuerst:matrix.org)


## Installation

```shell
npm install -g pev2-cli
```


## Usage

```shell
Usage:
    pev2 <path-to-query-file> [path-to-execution-plan]
Notes:
    This tool uses the pev2 to visualize PostgreSQL's execution plan including
    costs associated to each operation.
        more info: https://www.postgresql.org/docs/14/using-explain.html
    To let PostgreSQL generate the plan, prefix it with the following line:
        EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON)

    If you don't pass an execution plan, this tool will spawn `psql` to run the
    the query. Use the `PG*` environment variables to make sure `psql` can
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
```


## Contributing

If you have a question or need support using `pev2-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/pev2-cli/issues).
