import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '../RolesActivity/role.enum';
import { Major } from '../users/common/major.enum';
import { UserSubmissionService } from '../UserSubmission/user-submission.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { updateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService) {}


    @Post()
    async create(@Body() createReviewDto: CreateReviewDto) {

        try {

            this.reviewService.create(createReviewDto);

        } catch(error) {
            throw error;
        }
    
    }

    @Delete()
    deleteReview(@Body() deleteReview: updateReviewDto) {

        return this.reviewService.delete(deleteReview);

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

    // return reviews which are dedicated for the 'role' to see.
    @Get('reviews-role/:soldierId/:major/:module/:subject/:role')
    getReviewsByRole(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string,
        @Param('role') role: Role) {

        return this.reviewService.getReviewsByRole(id, major, module, subject, role);
    }

    @Put()
    updateReview(@Body() updateReviewDto: updateReviewDto) {

        try {
            let updated = this.reviewService.updateReview(updateReviewDto);
            return updated;
        }

        catch (error) {
            throw error;
        }
        
    }
}
