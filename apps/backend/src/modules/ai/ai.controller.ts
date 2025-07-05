import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { createApiResponse } from '@novel-craft/shared';
import { 
  AiProviderType, 
  PolishRequest, 
  RewriteRequest, 
  SuggestionRequest 
} from './interfaces/ai-provider.interface';

@ApiTags('AI Services')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get available AI providers' })
  @ApiResponse({ status: 200, description: 'Available providers retrieved successfully' })
  async getProviders() {
    const providers = await this.aiService.getAvailableProviders();
    return createApiResponse(true, providers, 'Available providers retrieved successfully');
  }

  @Post('polish')
  @ApiOperation({ summary: 'Polish text using AI' })
  @ApiResponse({ status: 200, description: 'Text polished successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async polishText(
    @Body() request: PolishRequest & { provider?: AiProviderType },
  ) {
    const { provider, ...polishRequest } = request;
    const result = await this.aiService.polishText(
      polishRequest,
      provider || AiProviderType.DEEPSEEK,
    );
    return createApiResponse(true, result, 'Text polished successfully');
  }

  @Post('rewrite')
  @ApiOperation({ summary: 'Rewrite text using AI' })
  @ApiResponse({ status: 200, description: 'Text rewritten successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async rewriteText(
    @Body() request: RewriteRequest & { provider?: AiProviderType },
  ) {
    const { provider, ...rewriteRequest } = request;
    const result = await this.aiService.rewriteText(
      rewriteRequest,
      provider || AiProviderType.DOUBAO,
    );
    return createApiResponse(true, result, 'Text rewritten successfully');
  }

  @Post('suggestions')
  @ApiOperation({ summary: 'Generate writing suggestions using AI' })
  @ApiResponse({ status: 200, description: 'Suggestions generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async generateSuggestions(
    @Body() request: SuggestionRequest & { provider?: AiProviderType },
  ) {
    const { provider, ...suggestionRequest } = request;
    const result = await this.aiService.generateSuggestions(
      suggestionRequest,
      provider || AiProviderType.DOUBAO,
    );
    return createApiResponse(true, result, 'Suggestions generated successfully');
  }

  @Post('chapters/:id/polish')
  @ApiOperation({ summary: 'Polish entire chapter using AI' })
  @ApiResponse({ status: 200, description: 'Chapter polished successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async polishChapter(
    @Param('id') chapterId: string,
    @Request() req,
    @Body() options: Partial<PolishRequest> & { provider?: AiProviderType } = {},
  ) {
    const { provider, ...polishOptions } = options;
    const result = await this.aiService.polishChapter(
      chapterId,
      req.user.id,
      polishOptions,
    );
    return createApiResponse(true, result, 'Chapter polished successfully');
  }

  @Post('batch/polish')
  @ApiOperation({ summary: 'Polish multiple text segments in batch' })
  @ApiResponse({ status: 200, description: 'Batch polish completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async batchPolish(
    @Body() request: {
      texts: string[];
      options?: Partial<PolishRequest>;
      provider?: AiProviderType;
    },
  ) {
    const { texts, options = {}, provider = AiProviderType.DEEPSEEK } = request;
    
    const results = await Promise.allSettled(
      texts.map((text, index) =>
        this.aiService.polishText(
          { ...options, text },
          provider,
        ).then(result => ({ index, ...result }))
      )
    );

    const successful = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    const failed = results
      .map((result, index) => ({ index, result }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ index, result }) => ({
        index,
        error: (result as PromiseRejectedResult).reason.message,
      }));

    return createApiResponse(
      true,
      {
        successful,
        failed,
        total: texts.length,
        successCount: successful.length,
        failureCount: failed.length,
      },
      'Batch polish completed'
    );
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze text quality and provide insights' })
  @ApiResponse({ status: 200, description: 'Text analysis completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async analyzeText(
    @Body() request: {
      text: string;
      context?: string;
      provider?: AiProviderType;
    },
  ) {
    const { text, context, provider = AiProviderType.DEEPSEEK } = request;
    
    // Generate comprehensive analysis
    const [
      grammarSuggestions,
      styleSuggestions,
      plotSuggestions,
    ] = await Promise.allSettled([
      this.aiService.generateSuggestions(
        { text, type: 'dialogue', context },
        provider,
      ),
      this.aiService.generateSuggestions(
        { text, type: 'description', context },
        provider,
      ),
      this.aiService.generateSuggestions(
        { text, type: 'plot', context },
        provider,
      ),
    ]);

    const analysis = {
      text,
      wordCount: text.length,
      suggestions: {
        grammar: grammarSuggestions.status === 'fulfilled' ? grammarSuggestions.value : null,
        style: styleSuggestions.status === 'fulfilled' ? styleSuggestions.value : null,
        plot: plotSuggestions.status === 'fulfilled' ? plotSuggestions.value : null,
      },
      provider,
    };

    return createApiResponse(true, analysis, 'Text analysis completed successfully');
  }
}
