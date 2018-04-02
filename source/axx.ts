
import {Stream, Writable, Readable} from "stream"
import {ChildProcess, spawn, exec} from "child_process"

export class AxxError extends Error {
	readonly code: number

	constructor(message: string, code: number) {
		super(message)
		this.code = code
	}
}

export async function wait(task: ChildProcess, record = false): Promise<string> {
	let stdout: string = ""
	let stderr: string = ""
	if (record) {
		task.stdout.on("data", data => stdout += data)
		task.stderr.on("data", data => stderr += data)
	}
	return new Promise<string>((resolve, reject) => {
		task.on("close", (code: number, signal: string) => {
			if (code === 0) resolve(stdout)
			else reject(new AxxError(`axx error: ${stderr}`, code))
		})
	})
}

export interface AxxConnector {
	stream: Writable
	result: Promise<string>
	endResult: Promise<string>
}

export default function axx(cmd: string, output?: AxxConnector, record = false): AxxConnector {
	const task = spawn(cmd, [], {
		shell: true,
		cwd: process.cwd(),
		env: process.env,
		stdio: "pipe"
	})

	if (output && task.stdout)
		task.stdout.pipe(output.stream)

	const waitWithOutput = (end: boolean) => Promise
		.all([wait(task, record), output.result])
		.then(([thisResult, nextResult]) => end ? nextResult : thisResult)

	return {
		stream: task.stdin,
		result: output ? waitWithOutput(false) : wait(task, record),
		endResult: output ? waitWithOutput(true) : wait(task, record)
	}
}

export interface NaxxOptions {
	cmd: string
	output: AxxConnector
	record: boolean
}

export function maxx(cmd: string, output?: AxxConnector): AxxConnector {
	return axx(cmd, output, true)
}

export function caxx(): AxxConnector {
	return {
		stream: process.stdout,
		result: Promise.resolve(""),
		endResult: Promise.resolve("")
	}
}

export function collect(): AxxConnector {
	const stream = new Writable()
	let data = ""
	const result = new Promise<string>((resolve, reject) => {
		stream.on("data", d => data += d)
		stream.on("close", () => resolve(data))
	})
	return {
		stream,
		result,
		endResult: result
	}
}

export function waxx(path: string): AxxConnector {return}
export function raxx(path: string, output?: AxxConnector, record = false): AxxConnector {return}

export {axx}
