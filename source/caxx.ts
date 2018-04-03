
import {AxxConnector} from "./axx"

export default function caxx(): AxxConnector {
	return {
		stream: process.stdout,
		result: Promise.resolve(""),
		firstResult: Promise.resolve("")
	}
}

export {caxx}
