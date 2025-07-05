import { PrismaClient } from '@prisma/client';
import { DocumentType } from '../src/common/constants/document-types';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create test project
  const project = await prisma.project.upsert({
    where: { id: 'test-project-id' },
    update: {},
    create: {
      id: 'test-project-id',
      title: '测试小说项目',
      description: '这是一个用于测试的小说项目',
      userId: user.id,
    },
  });

  console.log('✅ Created test project:', project.title);

  // Create test documents
  const outline = await prisma.document.upsert({
    where: { id: 'test-outline-id' },
    update: {},
    create: {
      id: 'test-outline-id',
      title: '故事大纲',
      content: `# 故事大纲

## 主要情节
1. 开端：主角发现神秘力量
2. 发展：学习控制力量，遇到挑战
3. 高潮：面对最终敌人
4. 结局：成长与救赎

## 主要冲突
- 内在冲突：自我怀疑与成长
- 外在冲突：与反派的对抗
- 环境冲突：适应新世界

## 主题
成长、友谊、勇气与责任`,
      type: 'OUTLINE',
      projectId: project.id,
    },
  });

  const characters = await prisma.document.upsert({
    where: { id: 'test-characters-id' },
    update: {},
    create: {
      id: 'test-characters-id',
      title: '人物设定',
      content: `# 人物设定

## 主角 - 李明
- 年龄：17岁
- 性格：内向但坚韧，有强烈的正义感
- 背景：普通高中生，意外获得特殊能力
- 目标：保护朋友和家人

## 女主角 - 王小雨
- 年龄：16岁
- 性格：活泼开朗，聪明机智
- 背景：转学生，隐藏着神秘身份
- 目标：寻找失踪的父亲

## 反派 - 暗影大师
- 年龄：未知
- 性格：冷酷无情，野心勃勃
- 背景：古老组织的首领
- 目标：获得终极力量统治世界`,
      type: 'CHARACTERS',
      projectId: project.id,
    },
  });

  console.log('✅ Created test documents');

  // Create test chapters
  const chapters = [
    {
      title: '第一章：觉醒',
      content: `# 第一章：觉醒

李明从来没有想过，自己平凡的生活会在这个雨夜发生翻天覆地的变化。

雨水敲打着窗户，发出有节奏的声响。他正在房间里复习功课，突然感到一阵奇怪的眩晕。书本上的文字开始模糊，仿佛在纸面上游动。

"这是怎么回事？"李明揉了揉眼睛，但眩晕感越来越强烈。

就在这时，他的手掌开始发出微弱的蓝光...`,
      order: 1,
    },
    {
      title: '第二章：初遇',
      content: `# 第二章：初遇

第二天早上，李明怀着忐忑不安的心情来到学校。昨晚发生的事情让他整夜难眠，他不确定那是否只是一个奇怪的梦。

"李明，你看起来很累。"同桌小张关心地问道。

"没什么，只是没睡好。"李明勉强笑了笑。

就在这时，班主任走进教室，身后跟着一个陌生的女孩。

"同学们，我们班来了一位新同学，王小雨。"

李明抬起头，目光与女孩相遇的瞬间，他感到手掌又开始发热...`,
      order: 2,
    },
  ];

  for (const chapterData of chapters) {
    const chapter = await prisma.chapter.create({
      data: {
        ...chapterData,
        wordCount: chapterData.content.length,
        projectId: project.id,
      },
    });
    console.log(`✅ Created chapter: ${chapter.title}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
