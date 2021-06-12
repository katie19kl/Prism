import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.schema';
import { UserSubmissionSchema } from '../UserSubmission/userSubmission.schema';
import { ReviewSchema } from '../review/review.schema';
import { UserSubmissionModule } from '../UserSubmission/user-submission.module';
import { UserSubmissionService } from '../UserSubmission/user-submission.service'


@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Reviews', schema: ReviewSchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'User-Submission', schema: UserSubmissionSchema}]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UserSubmissionService ]
})
export class UsersModule {}