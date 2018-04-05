
import axx, {maxx} from "./axx"
import jaxx from "./jaxx"

describe("jaxx", () => {

	test("jaxx- can pipe a string", async() => {
		const result = await jaxx(`hello`, maxx(`cat`)).result
		expect(result).toMatch(/hello/igm)
	})
})
