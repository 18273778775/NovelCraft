# Novel Craft AI小说润色系统

🎨 **专业的AI驱动小说创作与润色平台**

Novel Craft是一个现代化的小说创作平台，集成了DeepSeek和豆包双AI引擎，为作家提供专业的文本润色、改写、建议和分析服务。

## ✨ 主要特性

### 🤖 双AI引擎支持
- **DeepSeek AI**: 专业文本润色、深度分析、创作建议
- **豆包AI**: 快速文本润色、风格转换、内容改写
- 智能AI提供商选择和负载均衡

### 📚 完整的创作工作流
- **项目管理**: 创建、组织和管理小说项目
- **章节编辑**: 直观的章节创建和编辑界面
- **版本控制**: 章节历史记录和版本恢复
- **文档管理**: 项目相关文档的分类管理

### 🎨 现代化用户界面
- 响应式设计，支持桌面和移动设备
- 直观的用户体验和流畅的操作
- 实时预览和编辑功能
- 深色/浅色主题切换

### 🔒 安全可靠
- JWT令牌认证系统
- 用户数据隔离和保护
- 安全的API接口设计
- 完整的权限控制

## 🚀 技术栈

### 后端
- **框架**: NestJS (Node.js)
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT + Passport
- **API文档**: Swagger/OpenAPI
- **AI集成**: DeepSeek API + 豆包API

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: React Context + Hooks
- **UI组件**: 自定义组件库
- **样式**: CSS Modules + Tailwind CSS

### 开发工具
- **包管理**: pnpm + Workspace
- **代码质量**: ESLint + Prettier
- **测试**: Playwright E2E测试
- **Git钩子**: Husky
- **类型检查**: TypeScript

## 📦 项目结构

```
Novel Craft/
├── apps/
│   ├── backend/          # NestJS后端应用
│   │   ├── src/
│   │   │   ├── modules/  # 功能模块
│   │   │   ├── common/   # 公共组件
│   │   │   └── config/   # 配置文件
│   │   └── prisma/       # 数据库模式
│   └── frontend/         # React前端应用
│       ├── src/
│       │   ├── components/ # UI组件
│       │   ├── pages/     # 页面组件
│       │   ├── hooks/     # 自定义钩子
│       │   └── utils/     # 工具函数
├── packages/             # 共享包
├── docs/                 # 项目文档
├── e2e-tests/           # E2E测试
└── README.md
```

## 🛠️ 安装和运行

### 环境要求
- Node.js 18+
- pnpm 8+
- Git

### 1. 克隆项目
```bash
git clone https://github.com/18273778775/NovelCraft.git
cd NovelCraft
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
复制环境变量模板并配置：
```bash
cp apps/backend/.env.example apps/backend/.env
```

编辑 `apps/backend/.env` 文件，配置以下变量：
```env
# 数据库
DATABASE_URL="file:./dev.db"

# JWT密钥
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# DeepSeek AI配置
DEEPSEEK_API_KEY="your-deepseek-api-key"
DEEPSEEK_API_URL="https://api.deepseek.com"
DEEPSEEK_MODEL="deepseek-chat"

# 豆包AI配置（可选）
DOUBAO_API_KEY="your-doubao-api-key"
DOUBAO_API_URL="https://ark.cn-beijing.volces.com/api/v3/chat/completions"
DOUBAO_MODEL_ID="doubao-seed-1-6-flash-250615"
```

### 4. 初始化数据库
```bash
cd apps/backend
pnpm prisma generate
pnpm prisma db push
```

### 5. 启动开发服务器

#### 启动后端服务
```bash
cd apps/backend
pnpm dev
```
后端服务将运行在 http://localhost:3001

#### 启动前端服务
```bash
cd apps/frontend
pnpm dev
```
前端应用将运行在 http://localhost:3000

### 6. 访问应用
- **前端应用**: http://localhost:3000
- **API文档**: http://localhost:3001/api/docs
- **后端API**: http://localhost:3001

## 🎯 使用指南

### 1. 注册账户
访问 http://localhost:3000 并创建新账户

### 2. 创建项目
- 点击"创建项目"按钮
- 填写项目标题和描述
- 开始您的小说创作

### 3. 添加章节
- 在项目中点击"添加章节"
- 编写章节内容
- 保存章节

### 4. 使用AI润色
- 选择要润色的文本
- 选择AI提供商（DeepSeek或豆包）
- 选择润色风格和参数
- 获取AI润色结果并应用

### 5. 管理作品
- 查看项目统计信息
- 管理章节顺序
- 导出作品内容

## 🧪 测试

### 运行E2E测试
```bash
pnpm test:e2e
```

### 运行单元测试
```bash
# 后端测试
cd apps/backend
pnpm test

# 前端测试
cd apps/frontend
pnpm test
```

## 📊 AI功能测试报告

系统已通过完整的AI功能测试，详细报告请查看 [AI_TESTING_REPORT.md](./AI_TESTING_REPORT.md)

**测试结果摘要**:
- ✅ DeepSeek AI: 100%功能正常，4/4测试通过
- ✅ 豆包AI: 100%功能正常，2/2测试通过
- ✅ 系统整体: 100%可用性，所有核心功能正常

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - 提供专业的AI文本处理服务
- [火山引擎豆包](https://www.volcengine.com/product/doubao) - 提供快速的AI润色服务
- [NestJS](https://nestjs.com/) - 优秀的Node.js框架
- [React](https://reactjs.org/) - 强大的前端框架
- [Prisma](https://www.prisma.io/) - 现代化的数据库工具

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/18273778775/NovelCraft/issues)
- Email: 56185834+18273778775@users.noreply.github.com

---

**Novel Craft - 让AI助力您的小说创作之旅！** 🎉📚✨ - AI小说润色与编辑系统

一个基于AI的智能小说润色与编辑平台，专注于辅助作者完善AI生成的初稿，通过上下文感知的AI技术提供高质量的编辑建议。

## 🚀 功能特性

- **智能润色**：基于上下文的AI文本润色和改写
- **项目管理**：完整的小说项目组织和管理
- **章节编辑**：强大的富文本编辑器，支持Markdown
- **辅助文档**：大纲、人物设定等辅助创作文档管理
- **版本历史**：完整的编辑历史记录和版本回滚
- **批量导入**：支持Markdown文件批量导入章节
- **多模型支持**：集成豆包和DeepSeek等多个AI模型

## 🏗️ 技术架构

### Monorepo结构
```
novel-craft/
├── apps/
│   ├── backend/          # Nest.js后端API
│   └── frontend/         # React前端应用
├── packages/
│   └── shared/           # 共享类型和工具
└── docs/                 # 项目文档
```

### 技术栈
- **后端**: Nest.js + TypeScript + Prisma + PostgreSQL
- **前端**: React + TypeScript + Vite + shadcn/ui + React Query
- **AI服务**: 豆包(Doubao) + DeepSeek API
- **编辑器**: Tiptap富文本编辑器
- **包管理**: pnpm workspace

## 📋 开发环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Git

## 🛠️ 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd novel-craft
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 环境配置
```bash
# 复制环境变量模板
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 编辑环境变量文件，配置数据库连接和API密钥
```

### 4. 数据库设置
```bash
# 生成Prisma客户端
pnpm db:generate

# 推送数据库模式
pnpm db:push

# (可选) 运行种子数据
pnpm db:seed
```

### 5. 启动开发服务器
```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm backend:dev  # 后端服务 (http://localhost:3001)
pnpm frontend:dev # 前端服务 (http://localhost:3000)
```

## 📚 开发指南

### 项目结构说明

#### 后端 (apps/backend)
```
src/
├── modules/              # 功能模块
│   ├── auth/            # 用户认证
│   ├── users/           # 用户管理
│   ├── projects/        # 项目管理
│   ├── chapters/        # 章节管理
│   ├── documents/       # 文档管理
│   └── ai/              # AI服务
├── common/              # 共享组件
├── config/              # 配置管理
├── app.module.ts        # 根模块
└── main.ts              # 应用入口
```

#### 前端 (apps/frontend)
```
src/
├── components/          # React组件
│   ├── ui/             # 基础UI组件
│   └── features/       # 业务组件
├── hooks/              # 自定义钩子
├── lib/                # 工具库
├── pages/              # 页面组件
├── contexts/           # React上下文
└── types/              # 类型定义
```

#### 共享包 (packages/shared)
```
src/
├── types/              # TypeScript类型定义
├── dtos/               # 数据传输对象
└── utils/              # 工具函数
```

### 开发命令

```bash
# 开发
pnpm dev                 # 启动所有服务
pnpm backend:dev         # 仅启动后端
pnpm frontend:dev        # 仅启动前端

# 构建
pnpm build              # 构建所有包
pnpm shared:build       # 构建共享包

# 测试
pnpm test               # 运行所有测试
pnpm test:watch         # 监视模式测试

# 代码质量
pnpm lint               # 代码检查
pnpm format             # 代码格式化
pnpm type-check         # 类型检查

# 数据库
pnpm db:generate        # 生成Prisma客户端
pnpm db:push            # 推送数据库模式
pnpm db:migrate         # 运行数据库迁移
pnpm db:studio          # 打开Prisma Studio
```

## 🔧 配置说明

### 环境变量

#### 后端环境变量 (apps/backend/.env)
- `DATABASE_URL`: PostgreSQL数据库连接字符串
- `JWT_SECRET`: JWT签名密钥
- `DOUBAO_API_KEY`: 豆包API密钥
- `DEEPSEEK_API_KEY`: DeepSeek API密钥

#### 前端环境变量 (apps/frontend/.env)
- `VITE_API_URL`: 后端API地址

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您遇到问题或有疑问，请：

1. 查看 [文档](docs/)
2. 搜索 [Issues](../../issues)
3. 创建新的 [Issue](../../issues/new)

## 🗺️ 开发路线图

- [x] 项目基础设施搭建
- [ ] 后端核心架构
- [ ] 前端基础架构
- [ ] 核心业务功能
- [ ] AI集成与高级功能
- [ ] 测试与优化
- [ ] 部署与发布