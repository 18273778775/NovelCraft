import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { DoubaoService } from './providers/doubao.service';
import { DeepseekService } from './providers/deepseek.service';
import { ChaptersModule } from '../chapters/chapters.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 seconds timeout for AI requests
    }),
    ChaptersModule,
  ],
  controllers: [AiController],
  providers: [AiService, DoubaoService, DeepseekService],
  exports: [AiService],
})
export class AiModule {}
