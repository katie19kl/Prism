import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IndexingFormat } from "src/server/file-handling/common/IndexingFormat";
import { FileHandlingService } from "src/server/file-handling/file-handling.service";
import { FileManager } from "src/server/file-handling/managers/FileManager";
import { Major } from "src/server/users/common/major.enum";
import { UserSubmissionDTO } from "../../users/dto/user-submission.dto";
import { IUserSubmission } from "../iuser-submission.interface";
import { UserSubmissionService } from "../user-submission.service";

export class UserSubmissionDBHandler {

    constructor(@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>){

        
    }


    
    async updateSubmissionInDB(createUserSubmissionDto: UserSubmissionDTO, usertoken, arrFiles){
        
        let idFromJWT = UserSubmissionService.getIdFromJWT(usertoken);

        let currentTime = new Date();

        const filter = { 
            soldierId: idFromJWT,
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        
        };
        
        const update = { 
            submittedFiles: arrFiles,
            submittedTimeStamp: currentTime
            
        };
        
        let updatedSubmissionOfUser = await this.userSubmissionModel.findOneAndUpdate(filter, update, {
            new: true
        });

        return updatedSubmissionOfUser;

    }
}