import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../RolesActivity/role.enum';
import { Major } from '../users/common/major.enum';
import { CreateReviewDto } from './dto/create-review.dto';
import { updateReviewDto } from './dto/update-review.dto';
import { IReview } from './ireview.interface';

@Injectable()
export class ReviewService {

    constructor(@InjectModel('Reviews') private reviewsModel: Model<IReview>) {}

    async create(createReviewDto: CreateReviewDto) {

        let currentTime = new Date();
        createReviewDto.submittedTimeStamp = currentTime;

        return await this.reviewsModel.create(createReviewDto);
    }

    async delete(id: string, major: Major, module: string, subject: string) {

        let filter = {
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };

        return await this.reviewsModel.deleteOne(filter);
    }

    async getAllReviewsPerAssignment(id: string, major: Major, module: string, subject: string) {

        let filter = {
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };

        let allReviews =  await this.reviewsModel.find(filter);
    
        console.log(allReviews)

        return allReviews;
    }

    async getAllReviewsToShowSoldier(id: string, major: Major, module: string, subject: string) {

        let filter = {
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };

        let reviews = await this.reviewsModel.find(filter);
        let result = [];

        for (let review of reviews) {

            if (review.showTo.includes(Role.Soldier)) {
                result.push(review);
            }
        }

        
        console.log(reviews)
        console.log(result)

        return result;
    }

    async updateReview(updateReviewDto: updateReviewDto) {

        // all the following fields must be considered as the key(filter).
        let filter = {
            soldierId: updateReviewDto.soldierId,
            major: updateReviewDto.major,
            module: updateReviewDto.module,
            subject: updateReviewDto.subject,

            checkerId: updateReviewDto.checkerId,
            submittedTimeStamp: updateReviewDto.submittedTimeStamp
        };

        // check if the review exists:
        let review = await this.reviewsModel.findOne(filter);

        if (review) {

            if (updateReviewDto.grade !== undefined) {
                review.grade = updateReviewDto.grade;
            }

            if (updateReviewDto.comment !== undefined) {
                review.comment = updateReviewDto.comment;
            }

            if (updateReviewDto.showTo !== undefined) {
                review.showTo !== updateReviewDto.showTo;
            }

            // update the date:
            review.submittedTimeStamp = new Date();

            return await review.save();

        } else {
            throw new HttpException("Review does not exist", HttpStatus.NOT_FOUND);
        }

    }

}
