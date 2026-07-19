import { spawn } from 'node:child_process'

async function runGitCommand(command: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    /**
     * 捕获 stderr 输出
     */
    let stderrOutput = ''
    const childProcess = spawn(command, args, { shell: true, cwd: process.cwd() })

    childProcess.stdout.on('data', (data: Buffer) => {
      console.log(`stdout: ${data.toString()}`)
    })

    childProcess.stderr.on('data', (data: Buffer) => {
      stderrOutput += data.toString() // 捕获 stderr 输出
      console.error(`stderr: ${data.toString()}`)
    })

    childProcess.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}: ${stderrOutput}`))
      }
      else {
        resolve()
      }
    })
  })
}

export async function runGitCommands() {
  try {
    console.log('Stashing changes...')
    await runGitCommand('git', ['stash', 'save', '"update language files"']) // 修正 stash 命令

    console.log('Resetting to latest commit...')
    await runGitCommand('git', ['reset', '--hard'])

    console.log('Pulling latest changes...')
    await runGitCommand('git', ['pull', '--no-verify'])

    console.log('Applying stashed changes...')
    await runGitCommand('git', ['stash', 'pop'])

    console.log('Checking for merge conflicts...')
    await runGitCommand('git', ['diff', '--name-only', '--diff-filter=U']) // 检查冲突

    console.log('Adding all changes...')
    await runGitCommand('git', ['add', '-A'])

    console.log('Committing changes...')
    await runGitCommand('git', ['commit', '-m', '"update language files"', '--no-verify'])

    console.log('Pushing changes...')
    await runGitCommand('git', ['push', '--no-verify']) // 解开注释以推送更改

    console.log('All commands executed successfully.')
    return Promise.resolve('提交成功')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Error executing command: ${message}`)
    throw new Error(message)
  }
}
