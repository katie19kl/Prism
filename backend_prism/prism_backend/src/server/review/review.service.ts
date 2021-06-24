import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../RolesActivity/role.enum';
import { Major } from '../users/common/major.enum';
import { IUserSubmission } from '../UserSubmission/iuser-submission.interface';
import { UserSubmissionService } from '../UserSubmission/user-submission.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { updateReviewDto } from './dto/update-review.dto';
import { IReview } from './ireview.interface';

@Injectable()
export class ReviewService {

    constructor(@InjectModel('Reviews') private reviewsModel: Model<IReview>,
                @InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>,
                private usersSubmissionService: UserSubmissionService) {}

    async create(createReviewDto: CreateReviewDto) {

        // first check there is a user submission object.
        let soldierId = createReviewDto.soldierId;
        let major = createReviewDto.major;
        let module = createReviewDto.module;
        let subject = createReviewDto.subject;

        try {

            let userSubmission = await this.usersSubmissionService.getUserSubmissionByKey(
                soldierId, major, module, subject);


            if (userSubmission) {

                let filter = {
                    soldierId: soldierId,
                    major: major,
                    module: module,
                    subject: subject
                };
                
                // update the userSubmission field of "isChecked" to true since a review was given.
                // also add the grade description to the userSubmission object.
                await this.userSubmissionModel.updateOne(filter, {
                    isChecked: true,
                    gradeDescription: createReviewDto.gradeDescription
                });

                // create the review.
                createReviewDto.submittedTime = new Date().toLocaleTimeString();
                createReviewDto.submittedDate = new Date().toLocaleDateString();

                return await this.reviewsModel.create(createReviewDto);


            } else {
                throw new HttpException("No submission has been made by the soldier",
                    HttpStatus.NOT_FOUND);
            }

        } catch (error) {
            throw error;
        }
    }

    async delete(deleteReview: updateReviewDto) {

        let filter = {
            soldierId: deleteReview.soldierId,
            major: deleteReview.major,
            module: deleteReview.module,
            subject: deleteReview.subject,
            submittedDate: deleteReview.submittedDate,
            submittedTime: deleteReview.submittedTime,
            checkerId: deleteReview.checkerId,
            checkerRole: deleteReview.checkerRole
        };

        // deleting the review.
        let result = await this.reviewsModel.deleteOne(filter);

        // retrieving all the reivews for the current soldier, major, module and subject.
        let restReviews = await this.getAllReviewsPerAssignment(
            deleteReview.soldierId, deleteReview.major,
            deleteReview.module, deleteReview.subject);

        // no reviews left.
        if (restReviews.length === 0) {

            // retrieve the existing userSubmission object.
            let userSubmission = await this.usersSubmissionService.getUserSubmissionByKey(
                deleteReview.soldierId, deleteReview.major,
                deleteReview.module, deleteReview.subject);

            if (userSubmission) {
             
                

                let filterUserSub = {
                    soldierId: deleteReview.soldierId,
                    major: deleteReview.major,
                    module: deleteReview.module,
                    subject: deleteReview.subject
                };


                // update the userSubmission field of "isChecked" to false since
                // there are no reviews. Moreover, update the gradeDesc to undefined.
                await this.userSubmissionModel.updateOne(filterUserSub, {
                    isChecked: false,
                    gradeDescription: undefined
                });
            }
        }

        return result;
    }

    async getAllReviewsPerAssignment(id: string, major: Major, module: string, subject: string) {

        let filter = {
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };

        let allReviews =  await this.reviewsModel.find(filter);
    
      
        
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

        result.sort((a, b) => (a.submittedDate > b.submittedDate)
            ? 1 : (a.submittedDate === b.submittedDate) 
                ? ((a.submittedTime > b.submittedTime) ? 1 : -1) : -1);

        return result;
    }

    async getReviewsByRole(id: string, major: Major, 
        module: string, subject: string, role: Role) {

        let allReviews = await this.getAllReviewsPerAssignment(id, major, module, subject);
        let finalReviews = [];

        // check for reviews that are to be shown to the role specified by the 'role'.
        for (let review of allReviews) {

            if (review.showTo.includes(role)) {
                finalReviews.push(review);
            }
        }

        finalReviews.sort((a, b) => (a.submittedDate > b.submittedDate)
            ? 1 : (a.submittedDate === b.submittedDate) 
                ? ((a.submittedTime > b.submittedTime) ? 1 : -1) : -1);

        return finalReviews;
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
                review.showTo = updateReviewDto.showTo;
            }

            if (updateReviewDto.gradeDescription !== undefined) {
                review.gradeDescription = updateReviewDto.gradeDescription;
            }

            return await review.save();

        } else {
            throw new HttpException("Review does not exist", HttpStatus.NOT_FOUND);
        }

    }

}
