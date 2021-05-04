import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './review.schema';
import { UserSubmissionModule } from '../UserSubmission/user-submission.module';

@Module({
    imports: [
		MongooseModule.forFeature([{name: 'Reviews', schema: ReviewSchema}]),
        UserSubmissionModule
	],
    providers: [ReviewService],
    controllers: [ReviewController]
})
export class ReviewModule {}
