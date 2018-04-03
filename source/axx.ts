
import {Stream, Writable, Readable} from "stream"
import {ChildProcess, spawn, exec} from "child_process"
import {writeFile, createWriteStream, createReadStream} from "fs"

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

export default function axx(cmd: string, output?: AxxConnector, record = false): AxxConnector {
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

export {axx}

export function maxx(cmd: string, output?: AxxConnector): AxxConnector {
	return axx(cmd, output, true)
}
