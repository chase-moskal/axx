
import {Stream, Writable, Readable} from "stream"
import {ChildProcess, spawn, exec} from "child_process"
import {writeFile, createWriteStream, createReadStream} from "fs"

export interface AxxOptions {
	record?: boolean
	combineStderr?: boolean
}

export interface AxxConnector {
	stdin: Writable
	result: Promise<string>
	firstResult: Promise<string>
}

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
			if (code === 0) resolve(stdout + stderr)
			else reject(`axx error, code ${code}, signal ${signal}: ${stderr}`)
		})
	})
}

export default function axx(cmd: string, next?: AxxConnector, options: AxxOptions = {}): AxxConnector {
	const {
		record = false,
		combineStderr = false
	} = options

	const task = spawn(cmd, [], {
		shell: true,
		cwd: process.cwd(),
		env: process.env,
		stdio: "pipe"
	})

	if (next && task.stdout) task.stdout.pipe(next.stdin)
	if (next && task.stderr && combineStderr) task.stderr.pipe(next.stdin)

	async function chainWait(first: boolean): Promise<string> {
		if (!next) return wait(task, record)
		const [firstResult, nextResult] = await Promise.all([
			wait(task, record),
			next.result
		])
		return first ? firstResult : nextResult
	}

	return {
		stdin: task.stdin,
		result: chainWait(false),
		firstResult: chainWait(true)
	}
}

export {axx}

export function maxx(cmd: string, output?: AxxConnector, options: AxxOptions = {}): AxxConnector {
	return axx(cmd, output, {...options, record: true})
}
