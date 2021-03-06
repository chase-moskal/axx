
import axx from "./axx"
import waxx from "./waxx"
import {existsSync} from "fs"

test("writes to file", async() => {
	const testpath = "./dist/TEST.txt"
	const result = await axx(`cat LICENSE.txt`, waxx(testpath))
	expect(result).toBe("")
	expect(existsSync(testpath)).toBeTruthy()
})
