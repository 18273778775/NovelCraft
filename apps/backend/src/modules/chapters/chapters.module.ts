import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
// import { EditHistoryService } from './edit-history.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [ChaptersController],
  providers: [ChaptersService], // EditHistoryService
  exports: [ChaptersService], // EditHistoryService
})
export class ChaptersModule {}
