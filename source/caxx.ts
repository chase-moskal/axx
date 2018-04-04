
import {PassThrough} from "stream"
import {AxxConnector} from "./axx"

export default function caxx(): AxxConnector {

	const result = new Promise<string>((resolve, reject) => {
		process.stdout.on("close", () => resolve(""))
	})

	return {
		stdin: process.stdout,
		result,
		firstResult: result
	}
}

export {caxx}
