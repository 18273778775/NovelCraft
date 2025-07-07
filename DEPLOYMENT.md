# 🚀 Novel Craft 部署指南

## 📋 目录
- [快速开始](#快速开始)
- [Docker部署](#docker部署)
- [传统部署](#传统部署)
- [生产环境部署](#生产环境部署)
- [环境配置](#环境配置)
- [故障排除](#故障排除)

## 🚀 快速开始

### 前置要求
- Docker >= 20.0.0
- Docker Compose >= 2.0.0
- Git

### 一键部署
```bash
# 1. 克隆项目
git clone https://github.com/18273778775/NovelCraft.git
cd NovelCraft

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置必要的API密钥

# 3. 一键部署
./scripts/deploy.sh
```

## 🐳 Docker部署

### 开发环境
```bash
# 启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境
```bash
# 使用生产配置启动
./scripts/deploy.sh prod

# 或手动执行
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Docker服务说明

| 服务 | 端口 | 说明 | 健康检查 |
|------|------|------|----------|
| frontend | 3000 | React前端应用 | `/health` |
| backend | 3001 | NestJS后端API | `/api/health` |
| database | 5432 | PostgreSQL数据库 | `pg_isready` |
| nginx | 80/443 | 反向代理（生产环境） | - |
| redis | 6379 | 缓存服务（生产环境） | `redis-cli ping` |

## 🛠️ 传统部署

### 前置要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 开发环境设置
```bash
# 1. 安装依赖
pnpm install

# 2. 快速环境设置
./scripts/dev.sh

# 3. 启动服务（需要两个终端）
# 终端1：启动后端
pnpm backend:dev

# 终端2：启动前端
pnpm frontend:dev
```

### 手动设置步骤
```bash
# 1. 构建共享包
pnpm --filter shared build

# 2. 生成Prisma客户端
pnpm --filter backend db:generate

# 3. 设置数据库
pnpm --filter backend db:push

# 4. 构建后端
pnpm --filter backend build

# 5. 构建前端
pnpm --filter frontend build
```

## 🏭 生产环境部署

### 服务器要求
- CPU: 2核心以上
- 内存: 4GB以上
- 存储: 20GB以上
- 操作系统: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 安全配置
```bash
# 1. 创建专用用户
sudo useradd -m -s /bin/bash novelcraft
sudo usermod -aG docker novelcraft

# 2. 设置防火墙
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 3. 配置SSL证书（推荐使用Let's Encrypt）
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### 生产环境配置
```bash
# 1. 克隆项目到生产服务器
git clone https://github.com/18273778775/NovelCraft.git
cd NovelCraft

# 2. 配置生产环境变量
cp .env.example .env
# 编辑 .env 文件，设置生产环境配置

# 3. 启动生产服务
./scripts/deploy.sh prod

# 4. 设置自动启动
sudo systemctl enable docker
```

## ⚙️ 环境配置

### 必需配置
```env
# 数据库密码（强密码）
DB_PASSWORD=your_very_secure_password_here

# JWT密钥（至少32字符）
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# AI服务API密钥
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

### 可选配置
```env
# 豆包AI（可选）
DOUBAO_API_KEY=your-doubao-api-key-here
DOUBAO_MODEL_ID=doubao-pro-4k

# CORS配置
CORS_ORIGIN=https://your-domain.com

# 前端API地址
VITE_API_URL=https://your-domain.com/api

# Redis密码（生产环境）
REDIS_PASSWORD=your_redis_password_here

# 域名配置（生产环境）
DOMAIN=your-domain.com
SSL_EMAIL=your-email@example.com
```

### API密钥获取
- **DeepSeek**: https://platform.deepseek.com/
- **豆包**: https://console.volcengine.com/ark/

## 🔧 常用命令

### Docker管理
```bash
# 查看服务状态
docker-compose ps

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# 重启服务
docker-compose restart backend

# 进入容器
docker-compose exec backend sh
docker-compose exec database psql -U novel_craft_user -d novel_craft

# 清理和重建
docker-compose down -v
docker-compose up -d --build --force-recreate
```

### 数据库管理
```bash
# 数据库迁移
docker-compose exec backend pnpm db:push

# 数据库备份
docker-compose exec database pg_dump -U novel_craft_user novel_craft > backup.sql

# 数据库恢复
docker-compose exec -T database psql -U novel_craft_user novel_craft < backup.sql
```

## 🐛 故障排除

### 常见问题

#### 1. 端口占用
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001

# 停止占用端口的进程
sudo kill -9 <PID>
```

#### 2. Docker构建失败
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

#### 3. 数据库连接失败
```bash
# 检查数据库状态
docker-compose logs database

# 重启数据库
docker-compose restart database

# 检查数据库连接
docker-compose exec database pg_isready -U novel_craft_user
```

#### 4. 前端无法访问后端API
- 检查CORS配置
- 确认API地址配置正确
- 检查网络连接

#### 5. AI服务调用失败
- 验证API密钥是否正确
- 检查网络连接
- 查看后端日志确认错误信息

### 日志查看
```bash
# 查看所有服务日志
docker-compose logs

# 实时查看特定服务日志
docker-compose logs -f backend

# 查看最近的日志
docker-compose logs --tail=100 backend
```

### 性能监控
```bash
# 查看容器资源使用
docker stats

# 查看系统资源
htop
df -h
free -h
```

## 📞 技术支持

如果遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查GitHub Issues: https://github.com/18273778775/NovelCraft/issues
3. 提交新的Issue并提供详细的错误信息和日志

---

**祝您部署顺利！** 🎉
