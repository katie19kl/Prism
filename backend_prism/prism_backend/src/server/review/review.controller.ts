import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { UserSubmissionService } from '../UserSubmission/user-submission.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { updateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService,
        private usesSubmissionService: UserSubmissionService) {}


    @Post()
    async create(@Body() createReviewDto: CreateReviewDto) {

        // first check there is a user submission object.
        // use await!

        let soldierId = createReviewDto.soldierId;
//////////////////////////////////////////////////
        let major = createReviewDto.major;
        console.log(major, '--------------')
////////////////////////////////////////////////
        let module = createReviewDto.module;
        let subject = createReviewDto.subject;

        let userSubmission = await this.usesSubmissionService.getUserSubmissionByKey(soldierId, major, module, subject);

        if (userSubmission) {
            console.log("all good");

            createReviewDto.submittedTimeStamp = new Date();

            return this.reviewService.create(createReviewDto);

        } else {
            console.log("might be an error")
        }
    }

    
    @Delete(':soldierId/:major/:module/:subject')
    deleteReview(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        return this.reviewService.delete(id, major, module, subject);

    }

    @Get('all-reviews/:soldierId/:major/:module/:subject')
    getAll(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        return this.reviewService.getAllReviewsPerAssignment(id, major, module, subject);
    }

    // return reviews which are dedicated for the soldier to see.
    @Get('reviews-soldier/:soldierId/:major/:module/:subject')
    getReviewForSoldier(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        return this.reviewService.getAllReviewsToShowSoldier(id, major, module, subject);
    }

    @Put()
    updateReview(@Body() updateReviewDto: updateReviewDto) {

        // enable the commander/tester to update the following fields:
        // 1. comment- the review itself
        // 2. grade
        // 3. showTo
        return this.reviewService.updateReview(updateReviewDto);

    }

    
}
