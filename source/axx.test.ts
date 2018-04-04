
import axx, {maxx} from "./axx"

describe("axx", () => {

	test("axx- can run a command", async() => {
		const result = await maxx(`ls .`).result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})

	test("axx- can pipe forward", async() => {
		const result = await axx(`cat LICENSE.txt`, maxx(`grep Chase`)).result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})

	test("axx- supports first and last result", async() => {
		const connector = maxx(`cat LICENSE.txt`, axx(`cat`, maxx(`grep Chase`)))
		const [result, firstResult] = await Promise.all([
			await connector.result,
			await connector.firstResult
		])
		const {length} = result
		const {length: firstLength} = firstResult

		expect(result).toBeDefined()
		expect(firstResult).toBeDefined()
		expect(length).toBeGreaterThan(0)
		expect(firstLength).toBeGreaterThan(0)
		expect(length).not.toBe(firstLength)
	})
})
