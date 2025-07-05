import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, createApiResponse, PaginationParams } from '@novel-craft/shared';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(req.user.id, createProjectDto);
    return createApiResponse(true, project, 'Project created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async findAll(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const pagination: PaginationParams = { page, limit };

    let result;
    if (search) {
      result = await this.projectsService.searchProjects(req.user.id, search, pagination);
    } else {
      result = await this.projectsService.findAll(req.user.id, pagination);
    }

    return createApiResponse(true, result, 'Projects retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project found' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @Request() req) {
    const project = await this.projectsService.findOne(id, req.user.id);
    return createApiResponse(true, project, 'Project found');
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Project statistics retrieved' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getStats(@Param('id') id: string, @Request() req) {
    const stats = await this.projectsService.getProjectStats(id, req.user.id);
    return createApiResponse(true, stats, 'Project statistics retrieved');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, req.user.id, updateProjectDto);
    return createApiResponse(true, project, 'Project updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.projectsService.remove(id, req.user.id);
    return createApiResponse(true, result, 'Project deleted successfully');
  }
}
