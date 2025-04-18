import Zip from 'adm-zip'
import { Client } from 'ssh2';
import memfs from 'memfs'
import fs from 'fs'
import { getEcosystemConfigs } from './utils'

fs.writeFileSync('./.output/ecosystem.config.js', `
module.exports = ${JSON.stringify(getEcosystemConfigs("./.env.development"), null, 2)}`)

// const envContent = fs.readFileSync('./.env.development');

// fs.writeFileSync('./.env.development', envContent);

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
            conn.exec(`cd /root && unzip -o ./dist.zip -d /root/roxy_home`, function (err, stream) {
                if (err) throw err;
                stream
                    .on('close', function (code, signal) {
                        process.stdout.write("\n");
                        console.log('\x1B[34m%s\x1B[0m', '解压完毕！')
                        console.log('\x1B[32m%s\x1B[0m', '部署完成！')
                        conn.end();
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
    host: '47.242.33.58',
    port: 2211,
    username: 'root',
    password: '#_0P=5ziVE*VqJqR0aaFB7.h+NngD8NG'
});