
import axx from "./axx"
import waxx from "./waxx"
import {existsSync} from "fs"

test("waxx- writes and reads", async() => {
	const testpath = "./dist/TEST.txt"

	const result = await (axx(`cat LICENSE.txt`, waxx(testpath)).result)
	expect(result).toBe("")

	expect(existsSync(testpath)).toBeTruthy()
})
