# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- 修复章节创建表单中章节顺序字段的验证问题
  - 解决了当章节顺序字段为空时出现"Expected number, received nan"错误的问题
  - 改进了Zod schema的预处理逻辑，正确处理空值和字符串数字转换
  - 移除了不必要的`valueAsNumber`选项，改为在schema层面处理类型转换
- 添加了ChapterDialog组件的单元测试

### Added
- 新增ChapterDialog组件的单元测试覆盖

## [1.0.0] - 2025-01-05

### Added
- 🎉 Novel Craft AI小说润色系统首次发布
- 🤖 双AI引擎支持 (DeepSeek + 豆包)
- 📚 完整的小说创作工作流
- 🎨 现代化响应式用户界面
- 🔒 安全的用户认证系统
- 📊 项目和章节管理
- 🧪 完整的E2E测试覆盖

#### 核心功能
- 用户注册、登录和认证系统
- 项目创建和管理
- 章节编辑器和内容管理
- AI文本润色和改写功能
- 文档管理系统
- 版本控制和历史记录

#### 技术特性
- 后端: NestJS + Prisma + SQLite
- 前端: React + TypeScript + Vite
- AI集成: DeepSeek API + 豆包API
- 测试: Playwright E2E测试
- 开发工具: ESLint + Prettier + Husky

#### AI功能
- DeepSeek AI: 专业文本润色、深度分析、创作建议
- 豆包AI: 快速文本润色、风格转换、内容改写
- 智能AI提供商选择和负载均衡
- 多种润色风格和参数配置

#### 用户界面
- 响应式设计，支持桌面和移动设备
- 直观的用户体验和流畅的操作
- 实时预览和编辑功能
- 深色/浅色主题切换

#### 安全性
- JWT令牌认证系统
- 用户数据隔离和保护
- 安全的API接口设计
- 完整的权限控制

#### 测试覆盖
- 100% AI功能测试通过
- 完整的用户界面功能验证
- API接口测试覆盖
- 系统集成测试

#### 文档
- 详细的README.md和安装指南
- 完整的API文档 (Swagger)
- AI功能测试报告
- 开发文档和贡献指南
