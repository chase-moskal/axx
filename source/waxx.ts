
import {createWriteStream} from "fs"
import {AxxConnector} from "./axx"

export default function waxx(path: string): AxxConnector {
	const stdin = createWriteStream(path)
	const result = new Promise<string>((resolve, reject) => stdin.on("close", () => resolve("")))
	return {stdin, result}
}

export {waxx}
