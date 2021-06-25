import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReview } from '../review/ireview.interface';
import { ISubjectsOnDemand } from '../subjects-on-demand/subjects-on-demand.interface';
import { IUserSubmission } from '../UserSubmission/iuser-submission.interface';


@Injectable()
export class Synchronizer {

	
    constructor(
                
            @InjectModel('SubjectsOnDemand') private subjectOnDemandModel: Model<ISubjectsOnDemand>,
            @InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>,
            @InjectModel('Reviews') private reviewsModel: Model<IReview>,


            ){

    }


    async deleteSubmissionsByFilter(filter){
        await this.userSubmissionModel.deleteMany(filter)
    }

    async deleteReviewsByFilter(filter){
        await this.reviewsModel.deleteMany(filter)
    }

    async deleteSubjectDemands(filter){
        await this.subjectOnDemandModel.deleteOne(filter)
    }


    // Delete all submissions && reviews with deleted 
    // personalId && one document in subject on demand
    async syncUserDeletion(soldierDeletedId:String){

        await this.deleteSubmissionsByFilter({soldierId:soldierDeletedId})
        await this.deleteReviewsByFilter({soldierId:soldierDeletedId})
        return await this.deleteSubjectDemands({soldierId:soldierDeletedId})
        
    }
  
}
