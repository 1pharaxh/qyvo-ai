import path from 'path'
import { app } from 'electron'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { EventEmitter } from 'stream'

const isDev = !app.isPackaged

const exePath = isDev
  ? path.join(process.cwd(), 'backend/dist/chat_agent/chat_agent.exe')
  : path.join(process.resourcesPath, 'backend/dist/chat_agent/chat_agent.exe')

export class ChatAgent extends EventEmitter {
  process: ChildProcessWithoutNullStreams | null
  buffer: string[]

  constructor() {
    super()
    this.process = null
    this.buffer = []
  }

  start(): void {
    this.process = spawn(exePath, [], {
      cwd: path.dirname(exePath),
      stdio: ['pipe', 'pipe', 'pipe']
    })

    this.process.stdout.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean)
      lines.forEach((line) => {
        try {
          const parsed = JSON.parse(line)
          this.buffer.push(parsed)
          this.emit('output', parsed)
        } catch (err) {
          console.error('Failed to parse JSON:', err, line)
        }
      })
      console.log('buffer is  : ', this.buffer)
    })
    this.process.stderr.on('data', (data) => {
      const lines = data.toString().split(/\r?\n/).filter(Boolean)
      lines.forEach((line) => {
        this.buffer.push(line)
        this.emit('error', line)
      })
    })

    this.process.on('exit', (code) => {
      this.emit('exit', code)
      this.process = null
    })
  }

  sendMessage(msg: string): void {
    if (this.process && this.process.stdin.writable) {
      this.process.stdin.write(msg + '\n')
    }
  }

  read(): string[] {
    // return a copy of buffer
    return [...this.buffer]
  }

  stop(): void {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }
}
