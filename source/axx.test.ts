
import axx, {raxx, waxx} from "./axx"

describe("axx", () => {

	test("axx- can run the 'ls' command", async() => {
		const connector = axx(`ls .`, true)
		const result = await connector.result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})
	
	test("axx- can pipe commands", async() => {
		const connector = axx(`cat LICENSE.txt`, true, axx(`grep Chase`, true))
		const result = await connector.result
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})
	
	test("axx- supports first and end result", async() => {
		const connector = axx(`cat LICENSE.txt`, true, axx(`cat`, false, axx(`grep Chase`, true)))
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

	test("raxx- works", async() => {
		const connector = raxx(`LICENSE.txt`, true)
		const text = await connector.result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})

	test("raxx- pipes", async() => {
		const connector = raxx(`LICENSE.txt`, false, axx(`cat`, true))
		const text = await connector.result
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(100)
	})

	test("waxx- writes and reads", async() => {

		const result = await (axx(`cat LICENSE.txt`, false, waxx("./dist/TEST.txt")).result)
		expect(result).toBe("")

		const text = await (raxx(`./dist/TEST.txt`, true).result)
		expect(text).toBeDefined()
		expect(text.length).toBeGreaterThan(0)
	})
})
