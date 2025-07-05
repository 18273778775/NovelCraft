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

import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, createApiResponse } from '@novel-craft/shared';
import { DocumentType, DocumentTypeValue, DocumentTypeArray } from '../../common/constants/document-types';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('projects/:projectId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    const document = await this.documentsService.create(
      req.user.id,
      projectId,
      createDocumentDto,
    );
    return createApiResponse(true, document, 'Document created successfully');
  }

  @Post('defaults')
  @ApiOperation({ summary: 'Create default documents for project' })
  @ApiResponse({ status: 201, description: 'Default documents created successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async createDefaults(
    @Request() req,
    @Param('projectId') projectId: string,
  ) {
    const documents = await this.documentsService.createDefaultDocuments(
      req.user.id,
      projectId,
    );
    return createApiResponse(true, documents, 'Default documents created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for a project' })
  @ApiQuery({ name: 'type', required: false, enum: DocumentTypeArray })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findAll(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query('type') type?: DocumentTypeValue,
  ) {
    let documents;
    if (type) {
      documents = await this.documentsService.getDocumentsByType(
        req.user.id,
        projectId,
        type,
      );
    } else {
      documents = await this.documentsService.findAll(req.user.id, projectId);
    }
    return createApiResponse(true, documents, 'Documents retrieved successfully');
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get documents grouped by type' })
  @ApiResponse({ status: 200, description: 'Grouped documents retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getGrouped(@Request() req, @Param('projectId') projectId: string) {
    const documents = await this.documentsService.getProjectDocuments(
      req.user.id,
      projectId,
    );
    return createApiResponse(true, documents, 'Grouped documents retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @Request() req) {
    const document = await this.documentsService.findOne(id, req.user.id);
    return createApiResponse(true, document, 'Document found');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const document = await this.documentsService.update(
      id,
      req.user.id,
      updateDocumentDto,
    );
    return createApiResponse(true, document, 'Document updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.documentsService.remove(id, req.user.id);
    return createApiResponse(true, result, 'Document deleted successfully');
  }
}
