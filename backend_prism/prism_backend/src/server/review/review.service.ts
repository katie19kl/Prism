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

        createReviewDto.submittedTime = new Date().toLocaleTimeString();
        createReviewDto.submittedDate = new Date().toLocaleDateString();

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
    
        console.log(allReviews);

        allReviews.sort((a, b) => (a.submittedDate > b.submittedDate)
            ? 1 : (a.submittedDate === b.submittedDate) 
                ? ((a.submittedTime > b.submittedTime) ? 1 : -1) : -1);

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

        result.sort((a, b) => (a.submittedDate > b.submittedDate)
            ? 1 : (a.submittedDate === b.submittedDate) 
                ? ((a.submittedTime > b.submittedTime) ? 1 : -1) : -1);

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
            submittedTime: updateReviewDto.submittedTime,
            submittedDate: updateReviewDto.submittedDate
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
            review.submittedTime = new Date().toLocaleTimeString();
            review.submittedDate = new Date().toLocaleDateString();

            return await review.save();

        } else {
            throw new HttpException("Review does not exist", HttpStatus.NOT_FOUND);
        }

    }

}
