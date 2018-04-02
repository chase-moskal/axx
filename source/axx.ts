
import {writeFile, createWriteStream, createReadStream} from "fs"
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
			else reject(new AxxError(`axx error ${code} ${signal}: ${stderr}`, code))
		})
	})
}

export interface AxxConnector {
	stream: Writable
	result: Promise<string>
	firstResult: Promise<string>
}

export default function axx(cmd: string, record = false, output?: AxxConnector): AxxConnector {
	const task = spawn(cmd, [], {
		shell: true,
		cwd: process.cwd(),
		env: process.env,
		stdio: "pipe"
	})

	if (output && task.stdout)
		task.stdout.pipe(output.stream)

	async function waitWithOutput(end: boolean): Promise<string> {
		if (!output) return wait(task, record)
		const [thisResult, nextResult] = await Promise.all([
			wait(task, record),
			output.result
		])
		return end ? nextResult : thisResult
	}

	return {
		stream: task.stdin,
		result: waitWithOutput(true),
		firstResult: waitWithOutput(false)
	}
}

export interface NaxxOptions {
	cmd: string
	output: AxxConnector
	record: boolean
}

export function caxx(): AxxConnector {
	return {
		stream: process.stdout,
		result: Promise.resolve(""),
		firstResult: Promise.resolve("")
	}
}

export function collect(): AxxConnector {
	const stream = new Writable()
	let data = ""
	const result = new Promise<string>((resolve, reject) => {
		stream.on("data", d => data += d)
		stream.on("close", () => resolve(data))
	})
	return {stream, result, firstResult: result}
}

export function waxx(path: string): AxxConnector {
	const stream = createWriteStream(path)
	const result = new Promise<string>((resolve, reject) => stream.on("close", () => resolve("")))
	return {stream, result, firstResult: result}
}

export function raxx(path: string, record = false, output?: AxxConnector): AxxConnector {
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

export {axx}
