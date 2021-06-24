import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './review.schema';
import { UserSubmissionModule } from '../UserSubmission/user-submission.module';
import { UserSubmissionSchema } from '../UserSubmission/userSubmission.schema';


@Module({
    imports: [
        UserSubmissionModule,
		MongooseModule.forFeature([{name: 'Reviews', schema: ReviewSchema}]),
        MongooseModule.forFeature([{name: 'User-Submission', schema: UserSubmissionSchema}])
	],
    providers: [ReviewService],
    controllers: [ReviewController]
})
export class ReviewModule {}
