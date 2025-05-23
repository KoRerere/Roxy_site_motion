# Roxy官网

### 开起Gzip和Http2
```
http {
  gzip on;                      #开启gzip
  gzip_static on;               #如果已有.gz文件，则直接返回，没有就使用动态压缩
  gzip_min_length   10k;        #最小压缩大小
  gzip_buffers      4 16k;      #压缩缓冲区
  gzip_http_version 1.1;        #压缩版本
  gzip_comp_level   2;          #压缩等级
  #压缩类型
  gzip_types text/plain text/css application/javascript application/json text/xml application/xml application/xml+rss text/javascript image/svg+xml font/woff2;
  gzip_vary on; # 确保压缩后的内容能够被客户端正常缓存

  server {
    listen 443 ssl http2;
  }
}
```

### ghost 部署流程
1. 先在目录下配置 config.production.json 文件。注意 url，email，oss 相关的配置。然后启动容器

```
docker run -d --name roxy-ghost \
	--network=host \
	-e NODE_ENV=production \
	-v /root/roxy_home_blog/content:/var/lib/ghost/content \
	-v /root/roxy_home_blog/config.production.json:/var/lib/ghost/config.production.json \
	-p 2368:2368 \
ghost;
```

2. 注册 ghost 账号，首个注册的账号为超级管理员

3. 填写 email 配置，用户邀请相关人员进入博客后台系统

4. 生成 ghost 的 token 填写进 nuxt.config.ts 配置中。

5. 打包发布网站

发布网站可以使用pm2 再启一个进程，NuxtJS 监听3001端口，然后配置nginx访问3001端口，先做正式环境的测试。测试完把nginx roxybrowser.com 的域名的nginx反向代理，代理到3001端口。完成发布

#### 关于 oss
https://github.com/MT-Libraries/ghost-oss-store

#### 关于 ghost api
https://ghost.org/docs/content-api/

#### 关于 ghost 运行时的环境配置
https://ghost.org/docs/config/