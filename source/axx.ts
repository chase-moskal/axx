
import {Stream, Writable, Readable} from "stream"
import {ChildProcess, spawn, exec} from "child_process"

export async function wait(task: ChildProcess): Promise<string> {
	let stdout: string = ""
	let stderr: string = ""
	task.stdout.on("data", data => stdout += data)
	task.stderr.on("data", data => stderr += data)
	return new Promise<string>((resolve, reject) => {
		task.on("close", (code: number, signal: string) => {
			if (code === 0) resolve(stdout)
			else {
				const error = new Error(`error code ${code}: ${stderr}`)
				;(<any>error).code = code
				reject(error)
			}
		})
	})
}

export interface AxxConnector {
	data: Stream
	result: Promise<string>
}

export default function axx(cmd: string, input?: AxxConnector): AxxConnector {
	const task = spawn(cmd, [], {
		shell: true,
		cwd: process.cwd(),
		env: process.env,
		stdio: "pipe"
	})

	if (input) input.data.pipe(task.stdin)
	const data: Readable = task.stdout
	const waitWithInput = () => Promise.all([input.result, wait(task)])
		.then(([inputResult, taskResult]) => taskResult)

	return input
		? {data, result: waitWithInput()}
		: {data, result: wait(task)}
}

export {axx}
