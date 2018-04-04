
import axx, {maxx} from "./axx"
import raxx, {mraxx} from "./raxx"

describe("raxx", () => {

	test("raxx- reads from file", async() => {
		const connector = mraxx(`LICENSE.txt`)
		const text = await connector.result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})

	test("raxx- pipes forward", async() => {
		const connector = raxx(`LICENSE.txt`, maxx(`cat`))
		const text = await connector.result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})
})
