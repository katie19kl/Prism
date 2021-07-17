import { Module } from '@nestjs/common';
import { FileHandlingService } from './file-handling.service';
import { FileHandlingController } from './file-handling.controller';
import { UsersModule } from '../users/users.module';
import { SubjectsOnDemandModule } from '../subjects-on-demand/subjects-on-demand.module';
import { SynchronizerModule } from '../synchronizer/Synctonized.module';


@Module({
	exports : [FileHandlingService], 
	imports : [SubjectsOnDemandModule, UsersModule, SynchronizerModule],
	controllers: [FileHandlingController],
	providers: [FileHandlingService]
})
export class FileHandlingModule {}

