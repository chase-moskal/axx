
import {Stream, Writable, Readable} from "stream"
import {ChildProcess, spawn, exec} from "child_process"
import {writeFile, createWriteStream, createReadStream} from "fs"

export interface AxxOptions {
	record?: boolean
	combineStderr?: boolean
}

export interface AxxConnector {
	stdin: Writable
	stdout: Readable
	result: Promise<string>
}

export class AxxError extends Error {
	readonly code: number

	constructor(message: string, code: number) {
		super(message)
		this.code = code
	}
}

export async function wait(task: ChildProcess, {record = false, combineStderr = false}: AxxOptions = {}): Promise<string> {
	let stdout: string = ""
	let stderr: string = ""

	if (record) {
		task.stdout.on("data", data => stdout += data)
		task.stderr.on("data", data => stderr += data)
	}

	return new Promise<string>((resolve, reject) => {
		task.on("close", (code: number, signal: string) => {
			if (code === 0) resolve(combineStderr ? stdout + stderr : stdout)
			else reject(`axx error, code ${code}, signal ${signal}: ${stderr}`)
		})
		task.on("error", (error: Error) => {
			error.message = `axx error: ${error.message}`
			reject(error)
		})
	})
}

export default function axx(cmd: string, next?: AxxConnector, options: AxxOptions = {}): AxxConnector {

	const task = spawn(cmd, [], {
		shell: true,
		cwd: process.cwd(),
		env: process.env,
		stdio: "pipe"
	})

	if (next) task.stdout.pipe(next.stdin)
	if (next && options.combineStderr) task.stderr.pipe(next.stdin)

	async function chainWait(first: boolean): Promise<string> {
		if (!next) return wait(task, options)
		const [result, nextResult] = await Promise.all([
			wait(task, options),
			next.result
		])
		return first ? result : nextResult
	}

	return {
		stdin: task.stdin,
		stdout: task.stdout,
		result: chainWait(false)
	}
}

export {axx}

export function maxx(cmd: string, output?: AxxConnector, options: AxxOptions = {}): AxxConnector {
	return axx(cmd, output, {...options, record: true})
}
