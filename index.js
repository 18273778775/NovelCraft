/**
 * Novel Craft - AI驱动的智能小说润色系统
 * 
 * 这是一个完整的小说创作和润色平台，集成了先进的AI技术
 * 来帮助作者提升创作效率和作品质量。
 * 
 * @author 18273778775
 * @version 1.2.0
 * @license MIT
 */

const packageInfo = require('./package.json');

// 主模块导出
module.exports = {
  // 包信息
  name: packageInfo.name,
  version: packageInfo.version,
  description: packageInfo.description,
  
  // 使用说明
  usage: {
    install: 'npm install @18273778775/novel-craft',
    create: 'npx @18273778775/novel-craft create my-novel-app',
    setup: 'novel-craft setup',
    dev: 'novel-craft dev',
    build: 'novel-craft build'
  },
  
  // 功能特性
  features: [
    'AI智能润色 (DeepSeek + 豆包双引擎)',
    '用户认证和权限管理',
    '项目和章节管理',
    '文档管理系统',
    '实时协作编辑',
    'RESTful API',
    '响应式Web界面',
    'TypeScript全栈开发'
  ],
  
  // 技术栈
  techStack: {
    frontend: 'React 18 + TypeScript + Vite + Tailwind CSS',
    backend: 'NestJS + Prisma + PostgreSQL/SQLite',
    ai: 'DeepSeek API + 豆包 API',
    auth: 'JWT + bcrypt',
    tools: 'pnpm + ESLint + Prettier'
  },
  
  // 链接
  links: {
    repository: 'https://github.com/18273778775/NovelCraft',
    issues: 'https://github.com/18273778775/NovelCraft/issues',
    documentation: 'https://github.com/18273778775/NovelCraft#readme'
  },
  
  // 显示欢迎信息
  welcome() {
    console.log(`
🎨 Novel Craft v${this.version}
${this.description}

🚀 快速开始:
  ${this.usage.create}
  cd my-novel-app
  ${this.usage.setup}
  ${this.usage.dev}

📚 文档: ${this.links.documentation}
🐛 问题反馈: ${this.links.issues}
`);
  }
};

// 如果直接运行此文件，显示欢迎信息
if (require.main === module) {
  module.exports.welcome();
}
