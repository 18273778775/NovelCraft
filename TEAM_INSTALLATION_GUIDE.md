# 👥 Novel Craft 团队安装指南

## 🚀 快速开始

### 方式1: 使用CLI工具（推荐）

```bash
# 1. 全局安装CLI工具
npm install -g @18273778775/novel-craft

# 2. 创建新项目
novel-craft create my-novel-app

# 3. 进入项目目录
cd my-novel-app

# 4. 设置环境
novel-craft setup

# 5. 启动开发服务器
novel-craft dev
```

### 方式1b: 直接使用（无需安装）

```bash
# 1. 直接创建项目
npx @18273778775/novel-craft create my-novel-app

# 2. 进入项目并设置
cd my-novel-app
npx @18273778775/novel-craft setup
npx @18273778775/novel-craft dev
```

### 方式2: 直接克隆仓库

```bash
# 1. 克隆项目
git clone https://github.com/18273778775/NovelCraft.git
cd NovelCraft

# 2. 快速设置
./scripts/dev.sh

# 3. 启动服务
pnpm backend:dev  # 终端1
pnpm frontend:dev # 终端2
```

## 🔑 配置GitHub Packages访问

### 1. 创建GitHub Personal Access Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `read:packages` - 读取包
   - `write:packages` - 发布包（如果需要）
   - `repo` - 访问私有仓库（如果需要）

### 2. 配置npm认证

```bash
# 方式1: 使用npm login
npm login --scope=@18273778775 --registry=https://npm.pkg.github.com

# 方式2: 手动配置.npmrc
echo "@18273778775:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

### 3. 验证配置

```bash
npm whoami --registry=https://npm.pkg.github.com
```

## 📦 可用的包

### 主包: @18273778775/novel-craft
完整的Novel Craft应用程序

```bash
npm install @18273778775/novel-craft
```

**CLI命令**:
- `novel-craft init` - 初始化新项目
- `novel-craft setup` - 安装依赖和设置数据库
- `novel-craft dev` - 启动开发服务器
- `novel-craft build` - 构建应用

### 共享包: @18273778775/novel-craft-shared
共享的类型定义和工具

```bash
npm install @18273778775/novel-craft-shared
```

## 🛠️ 开发环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本

### 安装pnpm

```bash
npm install -g pnpm
```

## ⚙️ 环境配置

### 1. 配置API密钥

创建 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT配置
JWT_SECRET="your-jwt-secret-key"

# AI服务配置
DEEPSEEK_API_KEY="sk-64f2396064214545a04cb81ed9dc0380"
DOUBAO_API_KEY="2836e8fe-8f55-4eb9-9b68-bfca206e678e"
DOUBAO_MODEL_ID="doubao-pro-4k"

# CORS配置
CORS_ORIGIN="http://localhost:3000"
```

### 2. 数据库设置

```bash
# 生成Prisma客户端
pnpm db:generate

# 推送数据库schema
pnpm db:push
```

## 🚀 启动应用

### 开发模式

```bash
# 方式1: 同时启动前后端
pnpm dev

# 方式2: 分别启动
pnpm backend:dev  # 终端1 - 后端API
pnpm frontend:dev # 终端2 - 前端应用
```

### 访问地址

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001/api
- **API文档**: http://localhost:3001/api/docs

## 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 数据库操作
pnpm db:generate  # 生成Prisma客户端
pnpm db:push      # 推送schema到数据库
pnpm db:studio    # 打开数据库管理界面
```

## 🐛 故障排除

### 1. 包安装失败

```bash
# 清理缓存
npm cache clean --force
pnpm store prune

# 重新安装
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
```

### 2. GitHub Packages访问问题

```bash
# 检查认证状态
npm whoami --registry=https://npm.pkg.github.com

# 重新登录
npm logout --registry=https://npm.pkg.github.com
npm login --scope=@18273778775 --registry=https://npm.pkg.github.com
```

### 3. 端口占用

```bash
# 检查端口占用
lsof -i :3000
lsof -i :3001

# 杀死占用进程
kill -9 <PID>
```

## 📚 团队协作

### 1. 代码规范

项目使用以下工具确保代码质量：
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Husky**: Git hooks

### 2. 提交规范

使用约定式提交格式：
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

### 3. 分支策略

- `main`: 主分支，稳定版本
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

## 📞 技术支持

- **GitHub仓库**: https://github.com/18273778775/NovelCraft
- **Issues**: https://github.com/18273778775/NovelCraft/issues
- **文档**: 查看项目README.md

## 🎯 快速验证安装

```bash
# 1. 检查Node.js版本
node --version  # 应该 >= 18.0.0

# 2. 检查pnpm版本
pnpm --version  # 应该 >= 8.0.0

# 3. 验证包安装
npm list @18273778775/novel-craft

# 4. 测试CLI
npx @18273778775/novel-craft --help
```

---

**祝您使用愉快！** 🎉

如有问题，请随时在GitHub Issues中反馈。
