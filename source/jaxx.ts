
import {PassThrough, Writable, Readable} from "stream"
import {AxxConnector, AxxOptions} from "./axx"

export default function jaxx(data: string, next?: AxxConnector, options: AxxOptions = {}): AxxConnector {
	if (options.record) throw new Error("jaxx doesn't support the 'record' option")
	if (options.combineStderr) throw new Error("jaxx doesn't support the 'combineStderr' option")

	const stream = new PassThrough()
	if (next) stream.pipe(next.stdin)

	const firstResult = new Promise<string>((resolve, reject) => {
		stream.end(data, (error: Error) => {
			if (error) reject(error)
			else resolve("")
		})
	})

	const result = next
		? Promise.all([firstResult, next]).then(([first, next]) => next)
		: firstResult

	return {
		stdin: null,
		stdout: stream,
		then: result.then.bind(result),
		catch: result.catch.bind(result)
	}
}

export {jaxx}
