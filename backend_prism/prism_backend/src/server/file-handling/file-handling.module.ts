import { Module } from '@nestjs/common';
import { FileHandlingService } from './file-handling.service';
import { FileHandlingController } from './file-handling.controller';

@Module({
  controllers: [FileHandlingController],
  providers: [FileHandlingService]
})
export class FileHandlingModule {}
