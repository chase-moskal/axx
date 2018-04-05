
import {PassThrough} from "stream"
import axx from "./axx"
import caxx from "./caxx"

describe("caxx", () => {

	test("caxx- can log to the console", async() => {
		let data = ""
		const mockConsole = new PassThrough()
		mockConsole.on("data", d => data += d)
		await axx(`ls .`, caxx(mockConsole)).result
		expect(data).toBeDefined()
		expect(data.length).toBeGreaterThan(0)
	})
})
