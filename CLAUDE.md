```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
```

## 项目概览

这是一个使用 Nuxt 4 和 Vue 3 构建的 Roxy 官网项目，是一个反检测浏览器的官方网站，包含产品介绍、功能展示、博客、定价等页面。

## 项目结构

```
roxy-home-next/
├── packages/              # 工作区包
│   ├── backend-api/       # 后端 API 客户端
│   ├── language-localization/ # 语言本地化工具
│   ├── puppeteer-google-translate/ # Google 翻译工具
│   └── vite-plugins/      # Vite 插件
├── assets/                # 静态资源
├── components/            # Vue 组件
├── composables/           # 组合式函数
├── constants/             # 常量定义
├── data/                  # 数据文件
├── ghost/                 # Ghost 博客相关
├── i18n/                  # 国际化文件
├── layouts/               # 页面布局
├── middleware/            # 中间件
├── pages/                 # 页面组件（Nuxt 自动路由）
├── plugins/               # Vue 插件
├── public/                # 公共资源
├── scripts/               # 脚本文件
├── server/                # 服务器端代码
├── store/                 # 状态管理
├── types/                 # TypeScript 类型
└── utils/                 # 工具函数
```

## 常用命令

### 开发相关

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认开发环境）
pnpm dev

# 启动开发服务器（SheerID 版本）
pnpm dev:sheerid

# 启动开发服务器（HTTP/2）
pnpm dev:h2

# 构建生产版本
pnpm build

# 构建开发版本
pnpm build:dev

# 构建 SheerID 版本
pnpm build:sheerid

# 预览生产版本
pnpm preview

# 生成静态站点
pnpm generate
```

### 工具相关

```bash
# 检查中文代理措辞
pnpm check:zh-proxy

# 下载字体
pnpm fonts:download

# 生成语言文件
pnpm genLanguage

# 生成 OpenAPI 客户端
pnpm openapi

# 部署到开发环境
pnpm deploy:dev

# 部署到生产环境
pnpm deploy:prod

# 部署 SheerID 版本
pnpm deploy:sheerid

# 重新加载服务器
pnpm server-reload
```

### 包管理

```bash
# 构建所有包
pnpm build:pkg
```

## 技术栈

- **框架**: Nuxt 4 + Vue 3
- **样式**: UnoCSS + Tailwind
- **国际化**: @nuxtjs/i18n
- **动画**: motion-v
- **图片处理**: @nuxt/image + vite-imagetools
- **SEO**: @nuxtjs/seo + sitemap
- **HTTP 客户端**: axios
- **类型检查**: TypeScript
- **代码质量**: @antfu/eslint-config

## 开发环境配置

### 环境变量

项目使用 `ENV` 和 `SHEERID` 环境变量：
- `ENV=development`: 开发环境
- `ENV=production`: 生产环境
- `SHEERID=true`: 启用 SheerID 版本

### 主要配置文件

- `nuxt.config.ts`: Nuxt 配置
- `uno.config.ts`: UnoCSS 配置
- `package.json`: 项目依赖
- `tsconfig.json`: TypeScript 配置

## 重要功能说明

### 国际化

项目支持中文、英文和俄文三种语言：
- 语言文件位置: `i18n/locales/`
- 使用 `@nuxtjs/i18n` 模块
- 路由策略: prefix_and_default (默认英文)

### 博客系统

使用 Ghost CMS 作为博客引擎：
- 配置文件: `nuxt.config.ts` 中的 `ghostKey` 和 `ghostUrl`
- 博客页面: `pages/blog/`
- 博客组件: `components/page-blog/`

### 图片处理

使用 Nuxt Image 和 vite-imagetools 优化图片：
- 自动转换为 AVIF 和 WebP 格式
- 支持响应式图片
- 图片存储在 `assets/images/` 目录

### SVG 图标

项目使用自定义 SVG 图标系统：
- SVG 文件位置: `assets/svgs/`
- 自动生成类型文件: `components/rx-icon/svg-icon-types.ts`
- 使用 `<RxIcon>` 组件

## 部署说明

### 服务器配置

建议配置 Nginx 支持 Gzip 和 HTTP/2：

```nginx
server {
  listen 443 ssl http2;

  gzip on;
  gzip_static on;
  gzip_min_length 10k;
  gzip_buffers 4 16k;
  gzip_http_version 1.1;
  gzip_comp_level 2;
  gzip_types text/plain text/css application/javascript application/json text/xml application/xml application/xml+rss text/javascript image/svg+xml font/woff2;
  gzip_vary on;

  location ~* \.html$ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    add_header Last-Modified $date_gmt;
    add_header Pragma "no-cache";
    expires -1;
    etag off;
    if_modified_since off;
  }
}
```

### Ghost 部署

1. 配置 `config.production.json` 文件
2. 启动 Ghost 容器
3. 注册管理员账号
4. 配置邮箱和邀请人员
5. 生成 Ghost Token 并在 `nuxt.config.ts` 中配置
6. 打包发布网站

## 核心开发规范

### 组件命名

- 页面组件: `page-` 前缀（如 `page-home`）
- 通用组件: `rx-` 前缀（如 `rx-button`）
- 布局组件: `the-` 前缀（如 `the-header`）

### 代码规范

使用 @antfu/eslint-config 进行代码检查，运行：

```bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint:fix
```

### 提交规范

项目使用 git 提交，建议遵循 conventional commits 规范。
