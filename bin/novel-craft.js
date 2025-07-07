#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showBanner() {
  log('', 'blue');
  log('🎨 Novel Craft - AI驱动的智能小说润色系统', 'bold');
  log('================================================', 'blue');
  log('版本: 1.2.0', 'green');
  log('作者: 18273778775', 'green');
  log('仓库: https://github.com/18273778775/NovelCraft', 'blue');
  log('');
}

function showHelp() {
  log('📖 使用方法: novel-craft <命令>', 'bold');
  log('');
  log('命令:', 'yellow');
  log('  create <项目名>    创建新的Novel Craft项目', 'green');
  log('  dev               启动开发服务器', 'green');
  log('  build             构建项目', 'green');
  log('  setup             安装依赖并设置数据库', 'green');
  log('  start             启动生产服务器', 'green');
  log('  --version, -v     显示版本信息', 'green');
  log('  --help, -h        显示帮助信息', 'green');
  log('');
  log('示例:', 'yellow');
  log('  novel-craft create my-novel-app', 'blue');
  log('  novel-craft dev', 'blue');
  log('  novel-craft setup', 'blue');
  log('');
  log('📚 文档: https://github.com/18273778775/NovelCraft#readme', 'blue');
  log('🐛 问题反馈: https://github.com/18273778775/NovelCraft/issues', 'blue');
}

function createProject(projectName) {
  if (!projectName) {
    log('❌ 请提供项目名称', 'red');
    log('使用方法: novel-craft create <项目名>', 'yellow');
    return;
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  
  if (fs.existsSync(targetDir)) {
    log(`❌ 目录 ${projectName} 已存在`, 'red');
    return;
  }

  try {
    log(`📁 正在创建项目: ${projectName}`, 'blue');
    
    // 克隆项目
    execSync(`git clone https://github.com/18273778775/NovelCraft.git "${targetDir}"`, { 
      stdio: 'pipe' 
    });
    
    // 进入项目目录
    process.chdir(targetDir);
    
    // 删除.git目录，让用户可以初始化自己的git仓库
    if (fs.existsSync('.git')) {
      execSync('rm -rf .git', { stdio: 'pipe' });
    }
    
    log('✅ 项目创建成功!', 'green');
    log('');
    log('🚀 下一步:', 'yellow');
    log(`  cd ${projectName}`, 'blue');
    log('  novel-craft setup', 'blue');
    log('  novel-craft dev', 'blue');
    log('');
    log('📱 启动后访问:', 'yellow');
    log('  前端: http://localhost:3000', 'blue');
    log('  API: http://localhost:3001/api', 'blue');
    log('  文档: http://localhost:3001/api/docs', 'blue');
    
  } catch (error) {
    log('❌ 项目创建失败:', 'red');
    log(error.message, 'red');
    log('');
    log('💡 请检查:', 'yellow');
    log('  - 网络连接是否正常', 'blue');
    log('  - Git是否已安装', 'blue');
    log('  - 是否有足够的磁盘空间', 'blue');
  }
}

function runSetup() {
  try {
    log('⚙️ 正在设置Novel Craft...', 'blue');
    
    // 检查是否在Novel Craft项目目录中
    if (!fs.existsSync('package.json')) {
      log('❌ 当前目录不是Novel Craft项目', 'red');
      log('请先运行: novel-craft create <项目名>', 'yellow');
      return;
    }
    
    // 检查pnpm是否安装
    try {
      execSync('pnpm --version', { stdio: 'pipe' });
    } catch {
      log('📦 正在安装pnpm...', 'blue');
      execSync('npm install -g pnpm', { stdio: 'inherit' });
    }
    
    log('📦 正在安装依赖...', 'blue');
    execSync('pnpm install', { stdio: 'inherit' });
    
    log('🔨 正在构建共享包...', 'blue');
    execSync('pnpm --filter shared build', { stdio: 'inherit' });
    
    log('🗄️ 正在生成数据库客户端...', 'blue');
    execSync('pnpm --filter backend db:generate', { stdio: 'inherit' });
    
    // 检查后端.env文件
    const backendEnvPath = 'apps/backend/.env';
    if (!fs.existsSync(backendEnvPath)) {
      log('📝 正在创建后端环境配置...', 'blue');
      const envContent = `# Novel Craft 环境配置
NODE_ENV=development
PORT=3001

# 数据库配置 (SQLite for development)
DATABASE_URL="file:./dev.db"

# JWT配置
JWT_SECRET="novel-craft-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# AI服务配置
DEEPSEEK_API_KEY="sk-64f2396064214545a04cb81ed9dc0380"
DEEPSEEK_API_URL="https://api.deepseek.com"
DEEPSEEK_MODEL="deepseek-chat"

# 豆包AI配置
DOUBAO_API_KEY="2836e8fe-8f55-4eb9-9b68-bfca206e678e"
DOUBAO_API_URL="https://ark.cn-beijing.volces.com/api/v3"
DOUBAO_MODEL_ID="doubao-pro-4k"

# CORS配置
CORS_ORIGIN="http://localhost:3000"

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_DEST="./uploads"

# 限流配置
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
`;
      fs.writeFileSync(backendEnvPath, envContent);
    }
    
    log('🗄️ 正在设置数据库...', 'blue');
    execSync('pnpm --filter backend db:push', { stdio: 'inherit' });
    
    log('✅ 设置完成!', 'green');
    log('');
    log('🚀 现在可以启动开发服务器:', 'yellow');
    log('  novel-craft dev', 'blue');
    
  } catch (error) {
    log('❌ 设置失败:', 'red');
    log(error.message, 'red');
  }
}

function runDev() {
  try {
    log('🚀 正在启动开发服务器...', 'blue');
    log('');
    log('📱 访问地址:', 'yellow');
    log('  前端: http://localhost:3000', 'blue');
    log('  API: http://localhost:3001/api', 'blue');
    log('  文档: http://localhost:3001/api/docs', 'blue');
    log('');
    log('💡 提示: 使用 Ctrl+C 停止服务器', 'yellow');
    log('');
    
    // 启动开发服务器
    execSync('pnpm dev', { stdio: 'inherit' });
    
  } catch (error) {
    log('❌ 启动失败:', 'red');
    log('请先运行: novel-craft setup', 'yellow');
  }
}

function runBuild() {
  try {
    log('🔨 正在构建项目...', 'blue');
    execSync('pnpm build', { stdio: 'inherit' });
    log('✅ 构建完成!', 'green');
  } catch (error) {
    log('❌ 构建失败:', 'red');
    log(error.message, 'red');
  }
}

function runStart() {
  try {
    log('🚀 正在启动生产服务器...', 'blue');
    execSync('pnpm start', { stdio: 'inherit' });
  } catch (error) {
    log('❌ 启动失败:', 'red');
    log('请先运行: novel-craft build', 'yellow');
  }
}

// 主程序
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  showBanner();
  
  switch (command) {
    case 'create':
      createProject(args[1]);
      break;
      
    case 'setup':
      runSetup();
      break;
      
    case 'dev':
      runDev();
      break;
      
    case 'build':
      runBuild();
      break;
      
    case 'start':
      runStart();
      break;
      
    case '--version':
    case '-v':
      log('Novel Craft v1.2.0', 'green');
      break;
      
    case '--help':
    case '-h':
    case undefined:
      showHelp();
      break;
      
    default:
      log(`❌ 未知命令: ${command}`, 'red');
      log('');
      showHelp();
      break;
  }
}

main();
