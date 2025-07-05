import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ChaptersService } from './chapters.service';
import { CreateChapterDto, UpdateChapterDto, createApiResponse } from '@novel-craft/shared';

@ApiTags('Chapters')
@ApiBearerAuth()
@Controller('projects/:projectId/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chapter' })
  @ApiResponse({ status: 201, description: 'Chapter created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createChapterDto: CreateChapterDto,
  ) {
    const chapter = await this.chaptersService.create(
      req.user.id,
      projectId,
      createChapterDto,
    );
    return createApiResponse(true, chapter, 'Chapter created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all chapters for a project' })
  @ApiResponse({ status: 200, description: 'Chapters retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findAll(@Request() req, @Param('projectId') projectId: string) {
    const chapters = await this.chaptersService.findAll(req.user.id, projectId);
    return createApiResponse(true, chapters, 'Chapters retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chapter by ID' })
  @ApiResponse({ status: 200, description: 'Chapter found' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @Request() req) {
    const chapter = await this.chaptersService.findOne(id, req.user.id);
    return createApiResponse(true, chapter, 'Chapter found');
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get chapter content for editing' })
  @ApiResponse({ status: 200, description: 'Chapter content retrieved' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getContent(@Param('id') id: string, @Request() req) {
    const content = await this.chaptersService.getChapterContent(id, req.user.id);
    return createApiResponse(true, content, 'Chapter content retrieved');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    const chapter = await this.chaptersService.update(
      id,
      req.user.id,
      updateChapterDto,
    );
    return createApiResponse(true, chapter, 'Chapter updated successfully');
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Update chapter order' })
  @ApiResponse({ status: 200, description: 'Chapter order updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order position' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateOrder(
    @Param('id') id: string,
    @Request() req,
    @Body('order') newOrder: number,
  ) {
    const chapter = await this.chaptersService.updateChapterOrder(
      id,
      req.user.id,
      newOrder,
    );
    return createApiResponse(true, chapter, 'Chapter order updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.chaptersService.remove(id, req.user.id);
    return createApiResponse(true, result, 'Chapter deleted successfully');
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get chapter edit history' })
  @ApiResponse({ status: 200, description: 'Chapter history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getHistory(@Param('id') id: string, @Request() req) {
    const history = await this.chaptersService.getChapterHistory(id, req.user.id);
    return createApiResponse(true, history, 'Chapter history retrieved successfully');
  }

  @Get(':id/history/stats')
  @ApiOperation({ summary: 'Get chapter history statistics' })
  @ApiResponse({ status: 200, description: 'Chapter history stats retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getHistoryStats(@Param('id') id: string, @Request() req) {
    const stats = await this.chaptersService.getChapterHistoryStats(id, req.user.id);
    return createApiResponse(true, stats, 'Chapter history stats retrieved successfully');
  }

  @Post(':id/restore/:historyId')
  @ApiOperation({ summary: 'Restore chapter from history' })
  @ApiResponse({ status: 200, description: 'Chapter restored successfully' })
  @ApiResponse({ status: 404, description: 'Chapter or history not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async restoreFromHistory(
    @Param('id') id: string,
    @Param('historyId') historyId: string,
    @Request() req,
  ) {
    const chapter = await this.chaptersService.restoreChapterFromHistory(
      id,
      req.user.id,
      historyId,
    );
    return createApiResponse(true, chapter, 'Chapter restored successfully');
  }
}
