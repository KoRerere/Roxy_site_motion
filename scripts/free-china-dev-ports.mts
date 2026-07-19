import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const ports = [3002, 24678, 24679]

function killListeningPids(port: number) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port} "`, { encoding: 'utf8' })
    const pids = new Set<number>()
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes('LISTENING'))
        continue
      const pid = Number(line.trim().split(/\s+/).at(-1))
      if (pid > 0)
        pids.add(pid)
    }
    for (const pid of pids) {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' })
      console.log(`[free-china-dev-ports] freed port ${port} (PID ${pid})`)
    }
  }
  catch {
    // port not in use
  }
}

for (const port of ports)
  killListeningPids(port)

for (const dir of [
  join(process.cwd(), '.nuxt', 'cache'),
  join(process.cwd(), 'node_modules', '.cache', 'vite'),
]) {
  if (!existsSync(dir))
    continue
  rmSync(dir, { recursive: true, force: true })
  console.log(`[free-china-dev-ports] cleared ${dir}`)
}
