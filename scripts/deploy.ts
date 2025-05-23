import Zip from 'adm-zip'
import { Client } from 'ssh2';
import memfs from 'memfs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import fs from 'fs'
import { getEcosystemConfigs } from './utils'
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dir = 'roxy_home_new'

rl.question('您正准备发正式环境，请输入 1234 确认（这只是简单的验证，防止不小心执行错命令）：', (answer) => {
    if (answer === '1234') {
      console.log('验证成功，继续执行下一步...');
      // 下一步逻辑可以放这里，比如调用某个函数
      setup()
    } else {
      console.log('验证码错误，程序退出。');
    }
    rl.close();
});

async function setup() {
    fs.writeFileSync('./.output/ecosystem.config.js', `
        module.exports = ${JSON.stringify(getEcosystemConfigs("./.env.production"), null, 2)}`)
        
        // const envContent = fs.readFileSync('./.env.production');
        
        // fs.writeFileSync('./.env.production', envContent);
        
        // 创建虚拟文件系统
        const vfs = new memfs.Volume();
        const zip = new Zip();
        
        zip.addLocalFolder('./.output', '')
        
        const conn = new Client();
        conn.on('ready', function () {
            conn.sftp(function (err, sftp) {
                if (err) {
                    console.log(err);
                    throw 'error ' + err;
                }
                let bytesWritten = 0;
                const zipBuffer = zip.toBuffer();
                const totalSize = zipBuffer.length;
                vfs.writeFileSync('/dist.zip', zipBuffer);
                const readStream = vfs.createReadStream('/dist.zip')
        
                const writeStream = sftp.createWriteStream('/root/dist.zip');
        
                writeStream.on('close', function () {
                    conn.exec(`cd /root && unzip -o ./dist.zip -d /root/${dir}`, function (err, stream) {
                        if (err) throw err;
                        stream
                            .on('close', function (code, signal) {
                                process.stdout.write("\n");
                                console.log('\x1B[34m%s\x1B[0m', '解压完毕！')
                                console.log('\x1B[32m%s\x1B[0m', '部署完成！') 
                                setTimeout(() => {
                                    notifyRobot();
                                    conn.end();
                                }, 5000)
                            })
                            .on('data', function (data) {
                                const input = "文件上传完成，正在解压..."
                                process.stdout.write(`\x1B[34m${input}\x1B[0m \r`)
                            });
                    });
                });
        
        
                readStream.on('data', (chunk) => {
                    bytesWritten += chunk.length;
                    const progress = `文件上传中：${((bytesWritten / totalSize) * 100).toFixed(2)}%`
                    process.stdout.write(`\x1B[34m${progress}\x1B[0m \r`)
                    if (bytesWritten === totalSize) {
                        process.stdout.write("\n");
                    }
                });
        
                writeStream.on('end', function () {
                    console.log('sftp connection closed');
                    conn.end();
                });
        
                readStream.pipe(writeStream);
            });
        })
            .connect({
                host: '8.217.98.238',
                port: 2211,
                username: 'root',
                password: '+Jb5M~XLbbmqj2uLTZcDx=r6XuC6ZDU5'
            });
        
        async function notifyRobot() {
            const json = readFileSync(path.resolve(process.cwd(), './indexnow.json'), 'utf-8')
            const key = json && JSON.parse(json).key
            console.log("indexnow: ", key)
            const hasKeyFile = key && existsSync(path.resolve(process.cwd(), `./public/${key}.txt`))
            
            if (hasKeyFile) {
                const searchEngines = [
                    'https://api.indexnow.org',
                    'https://www.bing.com',
                    'https://searchadvisor.naver.com',
                    'https://search.seznam.cz',
                    'https://yandex.com',
                    'https://indexnow.yep.com'
                ]
                await Promise.allSettled(searchEngines.map(url =>
                    fetch(`${url}/indexnow?key=${key}&url=https://www.roxybrowser.com`)
                        .then(response => response.json())
                        .then(data => console.log('\x1B[32m%s\x1B[0m', `已通知${url}: ${JSON.stringify(data, null, 2)}`))
                ))
            }
            }
}