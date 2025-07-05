import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateDocumentDto, UpdateDocumentDto } from '@novel-craft/shared';
import { DocumentType, DocumentTypeValue, isValidDocumentType } from '../../common/constants/document-types';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(userId: string, projectId: string, createDocumentDto: CreateDocumentDto) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    return this.prisma.document.create({
      data: {
        title: createDocumentDto.title,
        content: createDocumentDto.content || '',
        type: createDocumentDto.type,
        project: {
          connect: { id: projectId }
        },
      },
    });
  }

  async findAll(userId: string, projectId: string) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: [
        { type: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByType(userId: string, projectId: string, type: DocumentTypeValue) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    return this.prisma.document.findMany({
      where: { 
        projectId,
        type,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return document;
  }

  async update(id: string, userId: string, updateDocumentDto: UpdateDocumentDto) {
    // Check if document exists and user has access
    await this.findOne(id, userId);

    try {
      return await this.prisma.document.update({
        where: { id },
        data: updateDocumentDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Document not found');
        }
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    // Check if document exists and user has access
    const document = await this.findOne(id, userId);

    try {
      return await this.prisma.document.delete({
        where: { id },
        select: {
          id: true,
          title: true,
          type: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Document not found');
        }
      }
      throw error;
    }
  }

  async getProjectDocuments(userId: string, projectId: string) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    // Get documents grouped by type
    const documents = await this.prisma.document.findMany({
      where: { projectId },
      orderBy: [
        { type: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Group documents by type
    const groupedDocuments = documents.reduce((acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = [];
      }
      acc[doc.type].push(doc);
      return acc;
    }, {} as Record<DocumentTypeValue, typeof documents>);

    return {
      outline: groupedDocuments[DocumentType.OUTLINE] || [],
      characters: groupedDocuments[DocumentType.CHARACTERS] || [],
      worldbuilding: groupedDocuments[DocumentType.WORLDBUILDING] || [],
      other: groupedDocuments[DocumentType.OTHER] || [],
    };
  }

  async getDocumentsByType(userId: string, projectId: string, type: DocumentTypeValue) {
    return this.findByType(userId, projectId, type);
  }

  async createDefaultDocuments(userId: string, projectId: string) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    const defaultDocuments = [
      {
        title: '故事大纲',
        content: `# 故事大纲

## 主要情节
1. 开端：
2. 发展：
3. 高潮：
4. 结局：

## 主要冲突
- 内在冲突：
- 外在冲突：
- 环境冲突：

## 主题
`,
        type: DocumentType.OUTLINE,
        projectId,
      },
      {
        title: '人物设定',
        content: `# 人物设定

## 主角
- 姓名：
- 年龄：
- 性格：
- 背景：
- 目标：

## 配角
- 姓名：
- 年龄：
- 性格：
- 背景：
- 作用：

## 反派
- 姓名：
- 年龄：
- 性格：
- 背景：
- 目标：
`,
        type: DocumentType.CHARACTERS,
        projectId,
      },
      {
        title: '世界观设定',
        content: `# 世界观设定

## 时代背景
- 时间：
- 地点：
- 社会环境：

## 世界规则
- 物理法则：
- 社会制度：
- 文化特色：

## 重要地点
- 地点名称：
- 地理位置：
- 重要性：
`,
        type: DocumentType.WORLDBUILDING,
        projectId,
      },
    ];

    const createdDocuments = await Promise.all(
      defaultDocuments.map(doc =>
        this.prisma.document.create({ data: doc })
      )
    );

    return createdDocuments;
  }
}
