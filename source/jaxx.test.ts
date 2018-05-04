
import axx, {maxx} from "./axx"
import jaxx from "./jaxx"

test("pipes a string", async() => {
	const result = await jaxx(`hello`, maxx(`cat`))
	expect(result).toMatch(/hello/igm)
})
