# pev2-cli

**Run the [PostgreSQL Explain Visualizer 2 (pev2)](https://github.com/dalibo/pev2) from the command line.**

[![npm version](https://img.shields.io/npm/v/pev2-cli.svg)](https://www.npmjs.com/package/pev2-cli)
[![build status](https://api.travis-ci.org/derhuerst/pev2-cli.svg?branch=master)](https://travis-ci.org/derhuerst/pev2-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/pev2-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/pev2-cli.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install -g pev2-cli
```


## Usage

```shell
Usage:
    pev2 <path-to-query-file>
Notes:
    This tool will run the query using the `psql` command-line tool.
Options:
    --open     -o  Open the URL in the browser.
    --once     -1  Stop serving after pev2 has received the data.
Examples:
    pev2 --open path/to/some-explain-query.sql
```


## Contributing

If you have a question or need support using `pev2-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/pev2-cli/issues).
