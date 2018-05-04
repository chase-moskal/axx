
import axx, {maxx} from "./axx"

test("run a command", async() => {
	const result = await maxx(`ls .`)
	expect(result).toBeDefined()
	expect(result.length).toBeGreaterThan(0)
})

test("pipe forward", async() => {
	const result = await axx(`cat LICENSE.txt`, maxx(`grep Chase`))
	expect(result).toBeDefined()
	expect(result.length).toBeGreaterThan(0)
})

test("fail a command gracefully", async() => {
	expect(axx(`exit 123`)).rejects.toBeDefined()
	expect(axx(`echo hello`, axx(`exit 123`))).rejects.toBeDefined()
	expect(axx(`exit 123`, axx(`echo hello`))).rejects.toBeDefined()
})
