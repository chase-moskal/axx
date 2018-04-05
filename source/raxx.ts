
import {createReadStream} from "fs"
import {AxxConnector, AxxOptions} from "./axx"

export default function raxx(path: string, next?: AxxConnector, {record = false}: AxxOptions = {}): AxxConnector {
	const stream = createReadStream(path)
	if (next) stream.pipe(next.stdin)

	let data = ""
	if (record) stream.on("data", d => data += d)

	const firstResult = new Promise<string>((resolve, reject) => {
		stream.on("close", () => resolve(data))
		stream.on("error", (error: Error) => reject(error))
	})

	const result = next
		? Promise.all([firstResult, next.result]).then(([first, next]) => next)
		: firstResult

	return {
		stdin: null,
		stdout: stream,
		result
	}
}

export {raxx}

export function mraxx(cmd: string, output?: AxxConnector, options: AxxOptions = {}): AxxConnector {
	return raxx(cmd, output, {...options, record: true})
}
