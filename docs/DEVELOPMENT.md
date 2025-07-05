# 开发指南

## 项目概述

NovelCraft是一个基于Monorepo架构的全栈应用，使用现代化的技术栈构建AI驱动的小说润色与编辑系统。

## 开发环境设置

### 必需软件
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Git

### IDE推荐配置
推荐使用VS Code，并安装以下扩展：
- TypeScript and JavaScript Language Features
- Prisma
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## 项目结构详解

### Monorepo架构
项目采用pnpm workspace管理多个包：
- `apps/backend`: Nest.js后端应用
- `apps/frontend`: React前端应用  
- `packages/shared`: 共享类型和工具

### 依赖管理
- 根目录的package.json管理开发工具和脚本
- 各包有独立的package.json管理自己的依赖
- 使用`workspace:*`引用内部包

## 开发工作流

### 1. 功能开发流程
1. 从main分支创建功能分支
2. 在shared包中定义类型和DTOs
3. 实现后端API
4. 实现前端组件
5. 编写测试
6. 提交代码并创建PR

### 2. 代码规范
- 使用TypeScript严格模式
- 遵循ESLint和Prettier配置
- 提交前自动运行lint和格式化
- 使用语义化的提交信息

### 3. 测试策略
- 后端：单元测试 + 集成测试
- 前端：组件测试 + E2E测试
- 共享包：工具函数单元测试

## 数据库开发

### Prisma工作流
1. 修改`schema.prisma`
2. 运行`pnpm db:generate`生成客户端
3. 运行`pnpm db:push`推送到开发数据库
4. 生产环境使用`pnpm db:migrate`

### 数据模型设计原则
- 使用cuid()作为主键
- 合理设置索引提升查询性能
- 使用级联删除维护数据一致性
- 枚举类型使用大写命名

## API开发规范

### RESTful设计
- 使用标准HTTP方法和状态码
- 统一的响应格式
- 合理的路由嵌套
- 版本控制策略

### 认证授权
- JWT token认证
- 基于角色的访问控制
- 路由级别的权限验证

## 前端开发规范

### 组件设计
- 使用函数组件和Hooks
- 组件职责单一
- Props类型严格定义
- 合理的组件拆分

### 状态管理
- React Query管理服务器状态
- React Context管理全局状态
- 本地状态使用useState

### 样式规范
- 使用Tailwind CSS
- shadcn/ui组件库
- 响应式设计
- 暗色主题支持

## 性能优化

### 后端优化
- 数据库查询优化
- 缓存策略
- 异步任务处理
- API响应压缩

### 前端优化
- 代码分割
- 懒加载
- 图片优化
- 缓存策略

## 部署指南

### 开发环境
```bash
pnpm dev
```

### 生产构建
```bash
pnpm build
```

### Docker部署
```bash
docker-compose up -d
```

## 故障排除

### 常见问题
1. **依赖安装失败**: 清除node_modules重新安装
2. **数据库连接失败**: 检查DATABASE_URL配置
3. **类型错误**: 运行`pnpm db:generate`重新生成类型
4. **端口冲突**: 修改.env文件中的端口配置

### 调试技巧
- 使用VS Code调试器
- 查看浏览器开发者工具
- 检查服务器日志
- 使用Prisma Studio查看数据

## 贡献指南

### 代码提交
- 使用语义化提交信息
- 每个提交应该是原子性的
- 提交前运行测试和lint

### Pull Request
- 提供清晰的描述
- 包含相关的测试
- 确保CI通过
- 请求代码审查

## 资源链接

- [Nest.js文档](https://docs.nestjs.com/)
- [React文档](https://react.dev/)
- [Prisma文档](https://www.prisma.io/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [shadcn/ui文档](https://ui.shadcn.com/)
