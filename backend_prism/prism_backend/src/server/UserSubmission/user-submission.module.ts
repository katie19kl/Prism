import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserSubmissionController } from './user-submission.controller';
import { UserSubmissionService } from './user-submission.service'
import { UserSubmissionSchema } from './userSubmission.schema'


@Module({

	imports: [
		MongooseModule.forFeature([{name: 'User-Submission', schema: UserSubmissionSchema}]),
		AuthModule,
		UsersModule
	],
	
	controllers: [UserSubmissionController],
	providers: [UserSubmissionService],
	exports: [UserSubmissionService]
})
export class UserSubmissionModule {}