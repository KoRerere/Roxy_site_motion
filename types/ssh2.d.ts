declare module 'ssh2' {
  import type { EventEmitter } from 'node:events'

  export interface ClientChannel extends EventEmitter {
    stderr: EventEmitter
  }

  export class Client extends EventEmitter {
    connect(config: Record<string, unknown>): void
    exec(
      command: string,
      callback: (err: Error | undefined, stream: ClientChannel) => void,
    ): void
    end(): void
  }
}
