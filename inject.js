setTimeout(() => {
	fetch('/data', {
		headers: {
			accept: 'application/json',
		},
		redirect: 'follow',
	})
	.then((res) => {
		if (res.ok) return res.json()
		const err = new Error(res.statusText)
		err.statusCode = res.status
		throw err
	})
	.then(({name, explainResult, query}) => {
		// eslint-disable-next-line no-undef
		setPlanData(name, explainResult, query)
	})
	.catch((err) => {
		// This is ugly but makes the error very visible.
		alert('failed to pass plan & query to PEV2: ' + err)
	})
}, 10)
