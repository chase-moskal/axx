
const {axx, caxx, maxx, collect} = require("./dist/axx")

;(async() => {

	const x = await (axx(`cat ./LICENSE.txt`, maxx(`grep chase`)).endResult)
	console.log(x.length)
	// const r = await (axx(`cat ./dist/axx.js`, caxx()).result)

})()
