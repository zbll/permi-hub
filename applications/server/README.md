# 服务器应用 (Server Application)

## 项目介绍

这是一个基于 **Deno** 和 **TypeORM** 构建的现代化服务器应用，采用 TypeScript 开发，是 monorepo 项目中的后端服务模块。项目提供了 RESTful API 服务，支持数据库操作、错误捕获和用户管理等功能。

### 技术栈
- **运行时**: Deno
- **语言**: TypeScript
- **Web框架**: Oak
- **ORM**: TypeORM
- **数据库**: MySQL (通过 mysql2 驱动)
- **包管理**: pnpm (workspace)

## 项目文件夹结构

```
applications/server/
├── .env*                    # 环境配置文件
├── .env.development         # 开发环境配置
├── .env.product             # 生产环境配置
├── .gitignore               # Git忽略文件
├── deno.json               # Deno配置文件
├── deno.lock               # Deno依赖锁文件
├── package.json            # Node.js包配置
├── tsconfig.json           # TypeScript配置
└── src/                    # 源代码目录
    ├── main.ts             # 应用入口文件
    ├── load-env.ts         # 环境变量加载
    ├── allow-catch.ts      # 错误捕获配置
    ├── connect/            # 数据库连接相关
    │   ├── data-source.ts  # 数据库连接配置
    │   ├── entity/         # 数据实体
    │   │   ├── User.ts     # 用户实体
    │   │   └── Catch.ts    # 错误捕获实体
    │   └── migration/      # 数据库迁移文件
    ├── controllers/        # 控制器层
    │   └── user/           # 用户相关控制器
    │       └── index.ts    # 用户控制器入口
    └── services/           # 服务层（预留）
```

## 项目规范

### 开发规范
1. **代码风格**: 使用 TypeScript 严格模式
2. **目录结构**: 遵循分层架构（控制器、服务、实体）
3. **命名规范**: 使用驼峰命名法，文件命名使用短横线分隔
4. **注释规范**: 所有代码注释使用中文

### 环境配置
- **开发环境**: 使用 `.env.development` 文件
- **生产环境**: 使用 `.env.product` 文件
- **默认环境**: 使用 `.env` 文件

### 依赖管理
- **主依赖**: 通过 `deno.json` 管理 Deno 依赖
- **NPM依赖**: 通过 `package.json` 管理 Node.js 依赖
- **工作区包**: 使用 pnpm workspace 管理内部包依赖

## 项目已包含功能

### 核心功能
1. **Web服务器**: 基于 Oak 框架的 HTTP 服务器
2. **数据库连接**: 使用 TypeORM 连接 MySQL 数据库
3. **CORS支持**: 跨域资源共享配置
4. **错误捕获**: 全局错误处理中间件
5. **自动路由注册**: 控制器自动注册功能

### 数据模型
1. **用户模型 (User)**
   - ID (主键)
   - 昵称 (nickname)
   - 邮箱 (email) 
   - 密码 (password)
   - IP地址 (ip)
   - 创建时间 (createAt)

2. **错误捕获模型 (Catch)**
   - ID (主键)
   - 错误信息 (message)
   - 请求路径 (path)
   - 请求方法 (requestMethod)
   - 请求参数 (requestParams)
   - 请求IP (requestIp)
   - 返回结果 (result)
   - 创建时间 (createAt)

### API接口
- **用户相关**: `/user/list` (GET) - 获取用户列表

## 快速开始

### 环境要求
- Deno 1.40+
- Node.js 18+
- pnpm 8+
- MySQL 8.0+

### 安装依赖
```bash
# 安装工作区依赖
pnpm install

# 安装 Deno 依赖（自动通过 deno.json 管理）
```

### 配置环境变量
复制环境配置文件并修改相应配置：
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

### 启动开发服务器
```bash
# 使用 Deno 开发模式（支持热重载）
denon task dev

# 或者使用 npm 脚本
npm run dev
```

服务器将在 `http://localhost:8080` 启动

### 构建项目
```bash
# 构建项目
deno task build
```

## 开发命令

### Deno 任务
- `deno task dev` - 启动开发服务器（带监听）
- `deno task update-db` - 更新数据库结构
- `deno task db-code` - 生成数据库相关代码

### NPM 脚本
- `npm run dev` - 开发模式启动
- `npm run build` - 构建项目

## 部署说明

### 生产环境部署
1. 配置生产环境变量文件 `.env.product`
2. 构建项目：`deno task build`
3. 部署构建后的文件到服务器
4. 启动服务

### 数据库迁移
项目使用 TypeORM 进行数据库管理，支持自动迁移：
```bash
deno task update-db
```

## 注意事项

1. **数据库连接**: 确保 MySQL 服务已启动并配置正确
2. **端口占用**: 默认使用 8080 端口，确保端口未被占用
3. **环境变量**: 不同环境使用不同的环境变量文件
4. **依赖管理**: 注意 Deno 和 Node.js 依赖的分离管理

## 贡献指南

1. 遵循项目代码规范
2. 添加适当的测试用例
3. 更新相关文档
4. 提交前运行代码检查

## 许可证

本项目遵循 monorepo 项目的整体许可证协议。