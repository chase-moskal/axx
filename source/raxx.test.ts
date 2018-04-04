
import axx, {maxx} from "./axx"
import raxx, {mraxx} from "./raxx"

describe("raxx", () => {

	test("raxx- reads from file", async() => {
		const text = await mraxx(`LICENSE.txt`).result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})

	test("raxx- pipes forward", async() => {
		const text = await raxx(`LICENSE.txt`, maxx(`cat`)).result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})

	test("raxx- fails gracefully", async() => {
		expect(raxx(`LICENSE-LOL-DOESNT-EXIST.txt`).result).rejects.toBeDefined()
	})
})
