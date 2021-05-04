import { Body, Controller, Post } from '@nestjs/common';
import { UserSubmissionService } from '../UserSubmission/user-submission.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService,
        private usesSubmissionService: UserSubmissionService) {}


    @Post()
    async create(@Body() createReviewDto: CreateReviewDto) {

        // first check there is a user submission object.
        // use await!
        //this.usesSubmissionService
        
        return this.reviewService.create(createReviewDto);
    }

}
