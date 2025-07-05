import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AiProvider, AiMessage, AiResponse, AiProviderConfig } from '../interfaces/ai-provider.interface';

@Injectable()
export class DoubaoService implements AiProvider {
  private readonly logger = new Logger(DoubaoService.name);
  public readonly name = 'doubao';

  private readonly config: AiProviderConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      apiKey: this.configService.get<string>('DOUBAO_API_KEY') || '',
      apiUrl: this.configService.get<string>('DOUBAO_API_URL') || 'https://ark.cn-beijing.volces.com/api/v3',
      model: this.configService.get<string>('DOUBAO_MODEL_ID') || '',
      maxTokens: 2000,
      temperature: 0.7,
    };
  }

  async generateText(messages: AiMessage[], config?: Partial<AiProviderConfig>): Promise<AiResponse> {
    const requestConfig = { ...this.config, ...config };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          requestConfig.apiUrl,
          {
            model: requestConfig.model,
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            max_tokens: requestConfig.maxTokens,
            temperature: requestConfig.temperature,
            stream: false,
          },
          {
            headers: {
              'Authorization': `Bearer ${requestConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const data = response.data;
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Doubao API');
      }

      const choice = data.choices[0];
      
      return {
        content: choice.message.content,
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
        model: data.model,
        finishReason: choice.finish_reason,
      };
    } catch (error: any) {
      this.logger.error('Doubao API error:', error.response?.data || error.message);
      throw new Error(`Doubao API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey && this.config.apiUrl && this.config.model);
  }
}
