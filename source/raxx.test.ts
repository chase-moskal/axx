
import axx, {maxx} from "./axx"
import raxx, {mraxx} from "./raxx"

test("reads from file", async() => {
	const text = await mraxx(`LICENSE.txt`)
	expect(text).toBeDefined()
	expect(text.length).toBeGreaterThan(100)
})

test("pipes forward", async() => {
	const text = await raxx(`LICENSE.txt`, maxx(`cat`))
	expect(text).toBeDefined()
	expect(text.length).toBeGreaterThan(100)
})

test("fails gracefully", async() => {
	expect(raxx(`LICENSE-LOL-DOESNT-EXIST.txt`)).rejects.toBeDefined()
})
