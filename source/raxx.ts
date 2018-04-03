
import {AxxConnector} from "./axx"
import {createReadStream} from "fs"

export default function raxx(path: string, output?: AxxConnector, record = false): AxxConnector {
	const stream = createReadStream(path)
	if (output) stream.pipe(output.stream)

	let data = ""
	if (record) stream.on("data", d => data += d)

	const firstResult = new Promise<string>((resolve, reject) => {
		stream.on("close", () => resolve(data))
	})

	const result = output
		? Promise.all([firstResult, output.result]).then(([first, next]) => next)
		: firstResult

	return {
		stream: null,
		firstResult,
		result
	}
}

export {raxx}

export function mraxx(cmd: string, output?: AxxConnector): AxxConnector {
	return raxx(cmd, output, true)
}
