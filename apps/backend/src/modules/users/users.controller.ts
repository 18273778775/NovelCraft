import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { createApiResponse } from '@novel-craft/shared';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
  async getCurrentUser(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    const { password: _, ...result } = user;
    return createApiResponse(true, result, 'User information retrieved successfully');
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getCurrentUserStats(@Request() req) {
    const stats = await this.usersService.getUserStats(req.user.id);
    return createApiResponse(true, stats, 'User statistics retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { password: _, ...result } = user;
    return createApiResponse(true, result, 'User found');
  }
}
