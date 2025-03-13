import eslint from '@eslint/js'
import globals from 'globals'

export default [
	eslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
		},
		rules: {
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false
				},
			],
		},
	},
	{
		languageOptions: {
			globals: globals.node,
		},
		ignores: [
			'inject.js',
		],
	},
	{
		files: [
			'inject.js',
		],
		languageOptions: {
			sourceType: 'script',
			globals: globals.browser,
		},
	},
]
