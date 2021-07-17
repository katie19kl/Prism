import { Body, Controller, Delete, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JWT_AuthGuard.guard';
import { Role } from '../RolesActivity/role.enum';
import { Role_Guard } from '../RolesActivity/Role_Guard.guard';
import { Major } from '../users/common/major.enum';
import { CreateReviewDto } from './dto/create-review.dto';
import { updateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';


@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService) {}


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
    @Post()
    async create(@Body() createReviewDto: CreateReviewDto) {

        try {

            this.reviewService.create(createReviewDto);

        } catch(error) {
            throw error;
        }
    
    }


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
    @Delete()
    deleteReview(@Body() deleteReview: updateReviewDto) {

        return this.reviewService.delete(deleteReview);

    }


    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
    @Get('all-reviews/:soldierId/:major/:module/:subject')
    getAll(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        return this.reviewService.getAllReviewsPerAssignment(id, major, module, subject);
    }


    @Get('reviews-soldier/:soldierId/:major/:module/:subject')
    getReviewForSoldier(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string) {

        return this.reviewService.getAllReviewsToShowSoldier(id, major, module, subject);
    }


    @Get('reviews-role/:soldierId/:major/:module/:subject/:role')
    getReviewsByRole(
        @Param('soldierId') id: string,
        @Param('major') major: Major,
        @Param('module') module: string,
        @Param('subject') subject: string,
        @Param('role') role: Role) {

        return this.reviewService.getReviewsByRole(id, major, module, subject, role);
    }

    
    @SetMetadata('roles', [Role.Admin, Role.Commander, Role.Tester])
	@UseGuards(Role_Guard)
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
