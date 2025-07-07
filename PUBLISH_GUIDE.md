# 📦 Novel Craft 发布指南

## 🚀 发布到GitHub Packages

### 1. 准备GitHub Personal Access Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `write:packages` - 发布包
   - `read:packages` - 读取包
   - `repo` - 访问仓库

### 2. 配置本地环境

```bash
# 设置环境变量
export NPM_TOKEN=your_github_token_here

# 配置npm认证
echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > ~/.npmrc
echo "@18273778775:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

### 3. 执行发布

```bash
# 运行发布脚本
./scripts/publish-packages.sh
```

## 📋 发布检查清单

### 发布前检查
- [ ] 代码已提交并推送到GitHub
- [ ] 版本号已更新
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] GitHub Token已配置

### 发布步骤
1. [ ] 构建shared包
2. [ ] 发布shared包到GitHub Packages
3. [ ] 准备主包
4. [ ] 发布主包到GitHub Packages
5. [ ] 验证包可以正常安装

### 发布后验证
- [ ] 包在GitHub Packages中可见
- [ ] 团队成员可以安装包
- [ ] CLI命令正常工作
- [ ] 文档链接正确

## 🔧 手动发布步骤

如果自动脚本有问题，可以手动发布：

### 1. 发布shared包

```bash
# 进入shared包目录
cd packages/shared

# 构建包
pnpm build

# 更新版本
npm version 1.1.0 --no-git-tag-version

# 发布
npm publish --registry=https://npm.pkg.github.com
```

### 2. 发布主包

```bash
# 回到根目录
cd ../..

# 创建发布版本的package.json
cat > package-publish.json << EOF
{
  "name": "@18273778775/novel-craft",
  "version": "1.1.0",
  "description": "AI-powered novel editing and polishing system",
  "main": "index.js",
  "bin": {
    "novel-craft": "./bin/novel-craft.js"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/18273778775/NovelCraft.git"
  },
  "author": "18273778775",
  "license": "MIT"
}
EOF

# 创建CLI入口
mkdir -p bin
cat > bin/novel-craft.js << 'EOF'
#!/usr/bin/env node
console.log('🎨 Novel Craft - AI-powered Novel Editing System');
const command = process.argv[2];
if (command === 'init') {
  const { execSync } = require('child_process');
  execSync('git clone https://github.com/18273778775/NovelCraft.git novel-craft-project', { stdio: 'inherit' });
  console.log('✅ Project initialized!');
} else {
  console.log('Usage: novel-craft init');
}
EOF

chmod +x bin/novel-craft.js

# 创建主入口
cat > index.js << 'EOF'
const packageInfo = require('./package.json');
console.log(`Novel Craft v${packageInfo.version}`);
module.exports = { version: packageInfo.version };
EOF

# 使用发布版本的package.json
cp package-publish.json package.json

# 发布
npm publish --registry=https://npm.pkg.github.com

# 恢复原始package.json
git checkout package.json

# 清理临时文件
rm -f package-publish.json index.js
rm -rf bin
```

## 🎯 团队使用指南

发布成功后，团队成员可以这样使用：

### 1. 配置GitHub Packages访问

```bash
# 配置npm
echo "@18273778775:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=TEAM_MEMBER_TOKEN" >> ~/.npmrc
```

### 2. 安装和使用

```bash
# 安装包
npm install @18273778775/novel-craft

# 初始化项目
npx @18273778775/novel-craft init

# 进入项目
cd novel-craft-project

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🔍 验证发布

### 1. 检查包是否发布成功

访问: https://github.com/18273778775/NovelCraft/packages

### 2. 测试安装

```bash
# 在临时目录测试
mkdir test-install
cd test-install

# 配置npm
echo "@18273778775:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> .npmrc

# 安装测试
npm install @18273778775/novel-craft

# 测试CLI
npx @18273778775/novel-craft init
```

## 🐛 常见问题

### 1. 发布失败 - 401 Unauthorized
- 检查GitHub Token权限
- 确认Token未过期
- 验证.npmrc配置

### 2. 包名冲突
- 确保包名使用正确的scope: `@18273778775/`
- 检查版本号是否已存在

### 3. 依赖问题
- 确保shared包先发布
- 检查依赖版本号匹配

## 📞 技术支持

如果遇到发布问题：
1. 检查GitHub Packages文档
2. 查看GitHub Issues
3. 联系项目维护者

---

**发布成功后，记得更新团队文档！** 🎉
