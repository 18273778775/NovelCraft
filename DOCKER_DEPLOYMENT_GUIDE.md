# 🐳 Novel Craft Docker 部署指南

## 📋 当前状态

✅ **已完成的配置**
- Docker Compose 配置文件
- 环境变量配置
- 部署脚本
- API密钥配置
- 文档和指南

⚠️ **Docker镜像构建问题**
由于pnpm workspace的复杂性，Docker镜像构建遇到依赖解析问题。

## 🚀 推荐部署方案

### 方案1: 传统部署（推荐）

这是目前最稳定的部署方式：

```bash
# 1. 克隆项目
git clone https://github.com/18273778775/NovelCraft.git
cd NovelCraft

# 2. 快速环境设置
./scripts/dev.sh

# 3. 启动服务（需要两个终端）
# 终端1：启动后端
pnpm backend:dev

# 终端2：启动前端  
pnpm frontend:dev
```

### 方案2: 数据库Docker化

只将数据库Docker化，应用使用传统方式运行：

```bash
# 1. 启动PostgreSQL数据库
docker run -d \
  --name novel-craft-db \
  -e POSTGRES_DB=novel_craft \
  -e POSTGRES_USER=novel_craft_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine

# 2. 更新后端.env文件
DATABASE_URL="postgresql://novel_craft_user:your_password@localhost:5432/novel_craft?schema=public"

# 3. 运行应用
./scripts/dev.sh
pnpm backend:dev  # 终端1
pnpm frontend:dev # 终端2
```

## 🔧 当前配置的API密钥

项目已配置以下API密钥：

```env
# DeepSeek AI
DEEPSEEK_API_KEY=sk-64f2396064214545a04cb81ed9dc0380

# 豆包AI (火山引擎)
DOUBAO_API_KEY=2836e8fe-8f55-4eb9-9b68-bfca206e678e
DOUBAO_MODEL_ID=doubao-pro-4k
```

## 📱 访问地址

部署成功后，您可以访问：

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:3001/api
- **API文档**: http://localhost:3001/api/docs
- **健康检查**: http://localhost:3001/api/health

## 🛠️ Docker问题解决方案

### 问题描述
Docker构建时遇到pnpm workspace依赖解析问题，主要表现为：
- NestJS依赖无法正确解析
- TypeScript编译失败
- 模块路径问题

### 临时解决方案
1. **使用传统部署方式**（推荐）
2. **分离构建**：先在本地构建，再复制到Docker
3. **简化依赖**：移除workspace配置，使用独立的package.json

### 未来改进计划
1. 重构项目结构，简化依赖管理
2. 创建独立的Docker镜像
3. 使用多阶段构建优化
4. 添加CI/CD自动构建

## 📋 部署检查清单

### 环境准备
- [ ] Node.js >= 18.0.0
- [ ] pnpm >= 8.0.0
- [ ] Git

### 配置检查
- [ ] API密钥已配置
- [ ] 数据库连接正常
- [ ] 端口3000和3001可用
- [ ] 防火墙配置正确

### 功能测试
- [ ] 用户注册/登录
- [ ] 项目创建
- [ ] AI润色功能
- [ ] 文件上传
- [ ] API文档访问

## 🔄 更新和维护

### 代码更新
```bash
git pull origin main
pnpm install
pnpm db:generate
pnpm db:push
```

### 重启服务
```bash
# 停止当前服务 (Ctrl+C)
# 重新启动
pnpm backend:dev  # 终端1
pnpm frontend:dev # 终端2
```

### 数据备份
```bash
# SQLite备份
cp apps/backend/dev.db apps/backend/dev.db.backup

# PostgreSQL备份
pg_dump -U novel_craft_user novel_craft > backup.sql
```

## 📞 技术支持

如果遇到问题：

1. **查看日志**：检查终端输出的错误信息
2. **检查端口**：确保3000和3001端口未被占用
3. **重新安装**：删除node_modules后重新安装
4. **GitHub Issues**：https://github.com/18273778775/NovelCraft/issues

## 🎯 生产环境部署

对于生产环境，建议：

1. **使用PM2管理进程**
2. **配置Nginx反向代理**
3. **使用PostgreSQL数据库**
4. **配置SSL证书**
5. **设置监控和日志**

---

**当前版本**: v1.1.0  
**最后更新**: 2025-07-06  
**状态**: Docker构建待优化，传统部署可用 ✅
