import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DoubaoService } from './providers/doubao.service';
import { DeepseekService } from './providers/deepseek.service';
import { ChaptersService } from '../chapters/chapters.service';
import { 
  AiProvider, 
  AiProviderType, 
  AiMessage, 
  PolishRequest, 
  RewriteRequest, 
  SuggestionRequest 
} from './interfaces/ai-provider.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly providers: Map<AiProviderType, AiProvider>;

  constructor(
    private readonly doubaoService: DoubaoService,
    private readonly deepseekService: DeepseekService,
    private readonly chaptersService: ChaptersService,
  ) {
    this.providers = new Map<AiProviderType, AiProvider>([
      [AiProviderType.DOUBAO, this.doubaoService as AiProvider],
      [AiProviderType.DEEPSEEK, this.deepseekService as AiProvider],
    ]);
  }

  private getProvider(providerType: AiProviderType): AiProvider {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new BadRequestException(`Provider ${providerType} not found`);
    }
    if (!provider.isAvailable()) {
      throw new BadRequestException(`Provider ${providerType} is not available`);
    }
    return provider;
  }

  async polishText(request: PolishRequest, providerType: AiProviderType = AiProviderType.DEEPSEEK) {
    const provider = this.getProvider(providerType);

    const systemPrompt = this.buildPolishSystemPrompt(request.style, request.focus);
    const userPrompt = this.buildPolishUserPrompt(request.text, request.context);

    const messages: AiMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await provider.generateText(messages, {
        temperature: 0.3, // Lower temperature for more consistent polishing
        maxTokens: Math.max(request.text.length * 2, 1000),
      });

      return {
        originalText: request.text,
        polishedText: response.content,
        provider: provider.name,
        usage: response.usage,
      };
    } catch (error) {
      this.logger.error(`Polish text error with ${provider.name}:`, error);
      throw error;
    }
  }

  async rewriteText(request: RewriteRequest, providerType: AiProviderType = AiProviderType.DOUBAO) {
    const provider = this.getProvider(providerType);

    const systemPrompt = this.buildRewriteSystemPrompt(request.tone, request.length, request.perspective);
    const userPrompt = this.buildRewriteUserPrompt(request.text, request.context);

    const messages: AiMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await provider.generateText(messages, {
        temperature: 0.8, // Higher temperature for more creative rewriting
        maxTokens: Math.max(request.text.length * 3, 1500),
      });

      return {
        originalText: request.text,
        rewrittenText: response.content,
        provider: provider.name,
        usage: response.usage,
      };
    } catch (error) {
      this.logger.error(`Rewrite text error with ${provider.name}:`, error);
      throw error;
    }
  }

  async generateSuggestions(request: SuggestionRequest, providerType: AiProviderType = AiProviderType.DOUBAO) {
    const provider = this.getProvider(providerType);

    const systemPrompt = this.buildSuggestionSystemPrompt(request.type);
    const userPrompt = this.buildSuggestionUserPrompt(request.text, request.context);

    const messages: AiMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await provider.generateText(messages, {
        temperature: 0.9, // High temperature for creative suggestions
        maxTokens: 1500,
      });

      return {
        text: request.text,
        suggestions: response.content,
        type: request.type,
        provider: provider.name,
        usage: response.usage,
      };
    } catch (error) {
      this.logger.error(`Generate suggestions error with ${provider.name}:`, error);
      throw error;
    }
  }

  async polishChapter(chapterId: string, userId: string, options: Partial<PolishRequest> = {}) {
    // Get chapter content
    const chapter = await this.chaptersService.getChapterContent(chapterId, userId);
    
    // Polish the content
    const polishResult = await this.polishText({
      text: chapter.content,
      style: options.style || 'literary',
      focus: options.focus || 'all',
      context: `这是小说《${chapter.title}》的一个章节内容。`,
    });

    return {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      ...polishResult,
    };
  }

  async getAvailableProviders() {
    const providers = [];
    
    for (const [type, provider] of this.providers) {
      providers.push({
        type,
        name: provider.name,
        available: provider.isAvailable(),
      });
    }

    return providers;
  }

  private buildPolishSystemPrompt(style?: string, focus?: string): string {
    const styleMap = {
      formal: '正式、严谨的文学风格',
      casual: '轻松、自然的口语化风格',
      literary: '优美、富有文学性的风格',
      modern: '现代、简洁的风格',
    };

    const focusMap = {
      grammar: '语法和用词的准确性',
      style: '文体和表达方式',
      flow: '语言的流畅性和连贯性',
      all: '语法、文体、流畅性等各个方面',
    };

    return `你是一位专业的中文文学编辑，擅长润色和改进文本。请按照以下要求润色文本：

风格要求：${styleMap[style || 'literary'] || '优美、富有文学性的风格'}
重点关注：${focusMap[focus || 'all'] || '语法、文体、流畅性等各个方面'}

润色原则：
1. 保持原文的核心意思和情感色彩
2. 改进语言表达，使其更加优美流畅
3. 修正语法错误和用词不当
4. 增强文本的可读性和感染力
5. 保持原文的长度和结构

请直接返回润色后的文本，不要添加解释或说明。`;
  }

  private buildPolishUserPrompt(text: string, context?: string): string {
    let prompt = `请润色以下文本：\n\n${text}`;
    
    if (context) {
      prompt = `背景信息：${context}\n\n${prompt}`;
    }

    return prompt;
  }

  private buildRewriteSystemPrompt(tone?: string, length?: string, perspective?: string): string {
    const toneMap = {
      serious: '严肃、庄重的语调',
      humorous: '幽默、轻松的语调',
      dramatic: '戏剧性、紧张的语调',
      romantic: '浪漫、温柔的语调',
    };

    const lengthMap = {
      shorter: '比原文更简洁',
      longer: '比原文更详细丰富',
      same: '与原文长度相近',
    };

    const perspectiveMap = {
      first: '第一人称视角',
      third: '第三人称视角',
    };

    return `你是一位创意写作专家，擅长改写和重新创作文本。请按照以下要求改写文本：

语调风格：${toneMap[tone || 'serious'] || '保持原文语调'}
长度要求：${lengthMap[length || 'same'] || '与原文长度相近'}
${perspective ? `视角要求：${perspectiveMap[perspective]}` : ''}

改写原则：
1. 保持核心情节和主要信息
2. 改变表达方式和句式结构
3. 调整语调和风格
4. 增强文本的表现力
5. 确保逻辑清晰、语言流畅

请直接返回改写后的文本，不要添加解释或说明。`;
  }

  private buildRewriteUserPrompt(text: string, context?: string): string {
    let prompt = `请改写以下文本：\n\n${text}`;
    
    if (context) {
      prompt = `背景信息：${context}\n\n${prompt}`;
    }

    return prompt;
  }

  private buildSuggestionSystemPrompt(type: string): string {
    const typeMap = {
      plot: '情节发展和故事走向',
      character: '人物塑造和性格发展',
      dialogue: '对话内容和表达方式',
      description: '场景描写和细节刻画',
    };

    return `你是一位资深的小说创作指导老师，擅长为作者提供创作建议。请针对${typeMap[type] || '文本内容'}提供专业的改进建议。

建议要求：
1. 具体可操作，不要泛泛而谈
2. 符合中文小说的创作习惯
3. 考虑读者的阅读体验
4. 提供2-3个具体的改进方向
5. 每个建议都要说明理由

请以清晰的条目形式返回建议，每条建议包含具体的改进方法和原因说明。`;
  }

  private buildSuggestionUserPrompt(text: string, context?: string): string {
    let prompt = `请为以下文本提供改进建议：\n\n${text}`;
    
    if (context) {
      prompt = `背景信息：${context}\n\n${prompt}`;
    }

    return prompt;
  }
}
