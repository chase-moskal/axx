
# axx

- execution of shell commands
- async/await functionality for easy concurrency control
- streaming, proper piping

### `npm install axx`

### `require("axx")`

*lean functions*

- [***axx***](https://github.com/chase-moskal/axx/blob/master/source/axx.ts#L43) — run shell command
- [***raxx***](https://github.com/chase-moskal/axx/blob/master/source/raxx.ts#L9) — read from file
- [***waxx***](https://github.com/chase-moskal/axx/blob/master/source/waxx.ts#L5) — write to file
- [***caxx***](https://github.com/chase-moskal/axx/blob/master/source/caxx.ts#L5) — log to stdout (the console)

*memory-hog functions*

- [***maxx***](https://github.com/chase-moskal/axx/blob/master/source/axx.ts#L77) — same as *axx*, but returns the full stdout result
- [***mraxx***](https://github.com/chase-moskal/axx/blob/master/source/raxx.ts#L34) — same as *raxx*, but returns the whole file to result

### tips

- remember -- `axx` and the other functions don't actually return *promises..*  
	instead, they will return an AxxConnector object, which *does* has the `result` promise property
- only `await` on the `result` promise of the *outer-most* `axx`-like call..  
	axx results only return when all of the chain's next outputs have returned

### examples

```javascript

const {axx, raxx, waxx} = require("axx")

const n = `$(npm bin)` // "node_modules/.bin"

async function build() {

	// minify a script
	await
	raxx(`myscript.js`,
		axx(`${n}/uglifyjs --compress --mangle`,
			waxx(`myscript.min.js`)
		)
	).result

	// run a few concurrent operations, wait for them all to complete
	await Promise.all([
		axx(`${n}/tsc`).result,
		axx(`cat src/a src/b`, waxx(`dist/c`)).result,
		axx(`${n}/node-sass --source-map true src/s.scss dist/s.css`).result
	])

	console.log("✔ done build")
}

```

*some more contrived examples*

```javascript

// log the package.json to the console just so i can see it
await raxx(`package.json`, caxx()).result

// alternative (memory-hog) way to log to the console
const text = await mraxx(`LICENSE.txt`).result
console.log(text)

```
