
import {AxxConnector} from "./axx"
import {createWriteStream} from "fs"

export default function waxx(path: string): AxxConnector {
	const stream = createWriteStream(path)
	const result = new Promise<string>((resolve, reject) => stream.on("close", () => resolve("")))
	return {stream, result, firstResult: result}
}

export {waxx}
