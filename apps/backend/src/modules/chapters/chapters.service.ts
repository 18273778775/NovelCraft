import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
// import { EditHistoryService } from './edit-history.service';
import { CreateChapterDto, UpdateChapterDto, countWords } from '@novel-craft/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    // private readonly editHistoryService: EditHistoryService,
  ) {}

  async create(userId: string, projectId: string, createChapterDto: CreateChapterDto) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    // Get the next order number if not provided
    let order = createChapterDto.order;
    if (order === undefined) {
      const lastChapter = await this.prisma.chapter.findFirst({
        where: { projectId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (lastChapter?.order || 0) + 1;
    }

    // Calculate word count
    const content = createChapterDto.content || '';
    const wordCount = countWords(content);

    return this.prisma.chapter.create({
      data: {
        ...createChapterDto,
        content,
        order,
        wordCount,
        projectId,
      },
    });
  }

  async findAll(userId: string, projectId: string) {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, userId);

    return this.prisma.chapter.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const chapter = await this.prisma.chapter.findUnique({
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

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    if (chapter.project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return chapter;
  }

  async update(id: string, userId: string, updateChapterDto: UpdateChapterDto) {
    // Check if chapter exists and user has access
    const existingChapter = await this.findOne(id, userId);

    // Calculate word count if content is being updated
    let wordCount = existingChapter.wordCount;
    if (updateChapterDto.content !== undefined) {
      wordCount = countWords(updateChapterDto.content);

      // Create edit history if content changed
      // if (updateChapterDto.content !== existingChapter.content) {
      //   await this.editHistoryService.createEditHistory(
      //     id,
      //     existingChapter.content,
      //     updateChapterDto.content,
      //   );
      // }
    }

    try {
      return await this.prisma.chapter.update({
        where: { id },
        data: {
          ...updateChapterDto,
          wordCount,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chapter not found');
        }
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    // Check if chapter exists and user has access
    const chapter = await this.findOne(id, userId);

    try {
      // Delete the chapter
      const deletedChapter = await this.prisma.chapter.delete({
        where: { id },
        select: {
          id: true,
          title: true,
          order: true,
          projectId: true,
        },
      });

      // Reorder remaining chapters
      await this.reorderChapters(chapter.projectId, deletedChapter.order);

      return deletedChapter;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chapter not found');
        }
      }
      throw error;
    }
  }

  async reorderChapters(projectId: string, deletedOrder?: number) {
    const chapters = await this.prisma.chapter.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      select: { id: true, order: true },
    });

    // If a chapter was deleted, adjust orders
    if (deletedOrder !== undefined) {
      const updates = chapters
        .filter(chapter => chapter.order > deletedOrder)
        .map(chapter => 
          this.prisma.chapter.update({
            where: { id: chapter.id },
            data: { order: chapter.order - 1 },
          })
        );

      await Promise.all(updates);
    } else {
      // Reorder all chapters to ensure sequential ordering
      const updates = chapters.map((chapter, index) =>
        this.prisma.chapter.update({
          where: { id: chapter.id },
          data: { order: index + 1 },
        })
      );

      await Promise.all(updates);
    }
  }

  async updateChapterOrder(
    id: string,
    userId: string,
    newOrder: number,
  ) {
    const chapter = await this.findOne(id, userId);
    const oldOrder = chapter.order;

    if (oldOrder === newOrder) {
      return chapter;
    }

    // Get all chapters in the project
    const chapters = await this.prisma.chapter.findMany({
      where: { projectId: chapter.projectId },
      orderBy: { order: 'asc' },
      select: { id: true, order: true },
    });

    // Validate new order
    if (newOrder < 1 || newOrder > chapters.length) {
      throw new BadRequestException('Invalid order position');
    }

    // Update orders in a transaction
    await this.prisma.$transaction(async (tx) => {
      if (newOrder > oldOrder) {
        // Moving down: shift chapters up
        await tx.chapter.updateMany({
          where: {
            projectId: chapter.projectId,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      } else {
        // Moving up: shift chapters down
        await tx.chapter.updateMany({
          where: {
            projectId: chapter.projectId,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }

      // Update the target chapter
      await tx.chapter.update({
        where: { id },
        data: { order: newOrder },
      });
    });

    return this.findOne(id, userId);
  }

  async getChapterContent(id: string, userId: string) {
    const chapter = await this.findOne(id, userId);
    return {
      id: chapter.id,
      title: chapter.title,
      content: chapter.content,
      wordCount: chapter.wordCount,
      order: chapter.order,
      projectId: chapter.projectId,
    };
  }

  async getChapterHistory(id: string, userId: string, limit = 50) {
    // Check if chapter exists and user has access
    await this.findOne(id, userId);

    // return this.editHistoryService.getEditHistory(id, limit);
    return []; // Temporary placeholder
  }

  async restoreChapterFromHistory(id: string, userId: string, historyId: string) {
    // Check if chapter exists and user has access
    const chapter = await this.findOne(id, userId);

    // Restore content from history
    // const restoredContent = await this.editHistoryService.restoreFromHistory(
    //   id,
    //   historyId,
    //   chapter.content,
    // );
    const restoredContent = chapter.content; // Temporary placeholder

    // Update chapter with restored content
    const wordCount = countWords(restoredContent);

    // Create edit history for the restoration
    // await this.editHistoryService.createEditHistory(
    //   id,
    //   chapter.content,
    //   restoredContent,
    // );

    return this.prisma.chapter.update({
      where: { id },
      data: {
        content: restoredContent,
        wordCount,
      },
    });
  }

  async getChapterHistoryStats(id: string, userId: string) {
    // Check if chapter exists and user has access
    await this.findOne(id, userId);

    // return this.editHistoryService.getHistoryStats(id);
    return { totalEdits: 0, lastEditDate: null }; // Temporary placeholder
  }
}
