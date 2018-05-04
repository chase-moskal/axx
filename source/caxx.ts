
import {PassThrough, Writable} from "stream"
import {AxxConnector} from "./axx"

export default function caxx(destination: Writable = process.stdout): AxxConnector {

	const stdin = new PassThrough()
	stdin.pipe(destination)

	const result = Promise.resolve("")

	return {
		stdin,
		stdout: stdin,
		then: result.then.bind(result),
		catch: result.catch.bind(result)
	}
}

export {caxx}
