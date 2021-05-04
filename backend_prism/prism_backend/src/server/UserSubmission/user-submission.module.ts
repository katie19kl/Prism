import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { UserSubmissionController} from './user-submission.controller';
import { UserSubmissionService} from './user-submission.service'
import {UserSubmissionSchema } from './userSubmission.schema'

@Module({

	imports: [
		UsersModule,
		MongooseModule.forFeature([{name: 'User-Submission', schema: UserSubmissionSchema}]),
	],
	
	controllers: [UserSubmissionController],
	providers: [UserSubmissionService]
})
export class UserSubmissionModule {}
