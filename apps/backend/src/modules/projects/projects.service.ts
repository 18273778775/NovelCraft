import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, PaginationParams } from '@novel-craft/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
      include: {
        _count: {
          select: {
            chapters: true,
            documents: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              chapters: true,
              documents: true,
            },
          },
        },
      }),
      this.prisma.project.count({
        where: { userId },
      }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            wordCount: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        documents: {
          orderBy: { type: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            documents: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    // Check if project exists and user has access
    await this.findOne(id, userId);

    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
        include: {
          _count: {
            select: {
              chapters: true,
              documents: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Project not found');
        }
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    // Check if project exists and user has access
    await this.findOne(id, userId);

    try {
      return await this.prisma.project.delete({
        where: { id },
        select: {
          id: true,
          title: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Project not found');
        }
      }
      throw error;
    }
  }

  async getProjectStats(id: string, userId: string) {
    // Check if project exists and user has access
    await this.findOne(id, userId);

    const [chapterCount, totalWords, documentCount] = await Promise.all([
      this.prisma.chapter.count({
        where: { projectId: id },
      }),
      this.prisma.chapter.aggregate({
        where: { projectId: id },
        _sum: {
          wordCount: true,
        },
      }),
      this.prisma.document.count({
        where: { projectId: id },
      }),
    ]);

    return {
      chapterCount,
      totalWords: totalWords._sum.wordCount || 0,
      documentCount,
    };
  }

  async searchProjects(userId: string, query: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      userId,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              chapters: true,
              documents: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
