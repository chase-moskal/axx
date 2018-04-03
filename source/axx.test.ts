
import axx from "./axx"

describe("axx", () => {

	test("axx- can run the 'ls' command", async() => {
		const connector = axx(`ls .`, null, true)
		const result = await connector.result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})
	
	test("axx- can pipe commands", async() => {
		const connector = axx(`cat LICENSE.txt`, axx(`grep Chase`, null, true), false)
		const result = await connector.result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})
	
	test("axx- supports first and end result", async() => {
		const connector = axx(`cat LICENSE.txt`, axx(`cat`, axx(`grep Chase`, null, true), false), true)
		const [result, firstResult] = await Promise.all([
			await connector.result,
			await connector.firstResult
		])
		const {length} = result
		const {length: firstLength} = firstResult
	
		expect(result).toBeDefined()
		expect(length).toBeGreaterThan(0)
		expect(firstLength).toBeGreaterThan(0)
		expect(length).not.toBe(firstLength)
	})
})
