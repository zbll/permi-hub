# 企业级权限管理系统

## 项目介绍

这是一个基于 Monorepo 架构的企业级权限管理系统，提供完整的用户管理、角色管理、权限控制和系统日志功能。系统采用前后端分离架构，前端使用现代化的 React 技术栈，后端使用高效的 Deno + Hono 框架，支持国际化、响应式设计和完善的表单验证。

## 技术栈

### 前端技术栈
- **框架**: React 19
- **路由**: React Router 7
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **表单管理**: TanStack React Form
- **状态管理**: Zustand
- **数据请求**: TanStack React Query + Axios
- **表格**: TanStack React Table
- **类型系统**: TypeScript
- **国际化**: i18next
- **UI组件**: Radix UI + 自定义组件库
- **验证**: Zod

### 后端技术栈
- **运行时**: Deno
- **框架**: Hono
- **ORM**: TypeORM
- **数据库**: MySQL
- **缓存**: Redis
- **邮件服务**: Nodemailer
- **日志**: 自定义日志系统

### 开发工具
- **包管理**: pnpm
- **Monorepo管理**: Lerna
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript

## 项目结构

```
monorepo-demo/
├── applications/
│   ├── client/          # 前端应用
│   │   ├── app/         # 应用代码
│   │   │   ├── api/     # API服务层
│   │   │   ├── components/  # 组件
│   │   │   ├── hooks/   # 自定义Hooks
│   │   │   ├── lib/     # 工具库
│   │   │   ├── locale/  # 国际化配置
│   │   │   ├── routes/  # 路由配置
│   │   │   └── stores/  # 状态管理
│   │   ├── public/      # 静态资源
│   │   └── ...          # 配置文件
│   └── server/          # 后端应用
│       ├── logs/        # 日志文件
│       ├── src/         # 应用代码
│       │   ├── connect/ # 数据库连接
│       │   ├── controllers/  # 控制器
│       │   ├── locale/  # 国际化配置
│       │   ├── redis/   # Redis连接
│       │   ├── services/     # 服务层
│       │   └── utils/   # 工具库
│       └── ...          # 配置文件
├── packages/            # 共享包
│   ├── console/         # 控制台工具
│   ├── encryption/      # 加密工具
│   ├── hooks/           # 共享Hooks
│   ├── middlewares/     # 中间件
│   └── types/           # TypeScript类型定义
├── LICENSE              # ISC许可证
└── ...                  # 根目录配置文件
```

## 主要功能

### 用户管理
- 用户注册和登录
- 个人信息修改
- 用户列表管理（增删改查）
- 角色分配

### 角色管理
- 角色创建、编辑和删除
- 权限分配
- 角色列表管理

### 权限管理
- 权限分组
- 权限分配给角色
- 权限列表查看

### 日志管理
- 系统操作日志记录
- 日志列表查看
- 日志详情查看

### 国际化
- 支持中英文切换
- 动态语言加载

## 安装和运行

### 前置条件
- Node.js >= 20.x
- pnpm >= 10.x
- Deno >= 1.45.x
- MySQL >= 8.x
- Redis >= 6.x

### 安装依赖

```bash
# 安装所有依赖（包括根目录和所有子包）
pnpm install
```

### 配置环境变量

#### 前端配置
复制 `applications/client/.env.example` 为 `applications/client/.env`，并配置相应的环境变量。

#### 后端配置
复制 `applications/server/.env.example` 为 `applications/server/.env`，并配置相应的环境变量。

### 运行项目

#### 开发模式

```bash
# 启动前端开发服务器
cd applications/client
pnpm dev

# 启动后端开发服务器
cd applications/server
pnpm dev
```

#### 生产模式

```bash
# 构建前端项目
cd applications/client
pnpm build

# 启动前端生产服务器
pnpm start

# 构建后端项目
cd applications/server
pnpm build

# 启动后端生产服务器
pnpm start
```

## 代码规范

### 前端代码规范
- 使用 TypeScript 编写所有代码
- 遵循 ESLint 和 Prettier 配置
- 组件采用函数式组件和 Hooks
- 表单使用 TanStack React Form
- 数据请求使用 TanStack React Query

### 后端代码规范
- 使用 TypeScript 编写所有代码
- 遵循 ESLint 和 Prettier 配置
- API 路由使用 RESTful 风格
- 数据库操作使用 TypeORM
- 服务层和控制器分离

## 贡献指南

1. 克隆项目到本地
2. 创建功能分支
3. 编写代码
4. 运行测试
5. 提交代码
6. 创建 Pull Request

## 许可证

该项目采用 [ISC 许可证](LICENSE) 开源。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：admin@example.com
- GitHub：https://github.com/example/monorepo-demo