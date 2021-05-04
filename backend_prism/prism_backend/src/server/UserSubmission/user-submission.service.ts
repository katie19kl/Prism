import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSubmissionSchema } from './userSubmission.schema';
import { UserSubmissionDTO } from '../users/dto/user-submission.dto';
import { IUserSubmission } from './iuser-submission.interface';
import { FileHandlingService } from '../file-handling/file-handling.service';

import { UserSubmissionFileHandler } from './userServiceFileHelper/userSubmissionFileHandler';
import { Major } from '../users/common/major.enum';


@Injectable()
export class UserSubmissionService {

    userSubmissionFileHandler: UserSubmissionFileHandler;
   

    // Model<IUserSubmission> ---- Broker  between DB & ME
    constructor(@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>) {


        this.userSubmissionFileHandler = new UserSubmissionFileHandler()
        //this.majorManager = new MajorManager()
        
    }

 
    async addNewUserSubmission(createUserSubmissionDto: UserSubmissionDTO, file) {

        // dir with user solutions
        let pathSolutionDir = this.userSubmissionFileHandler.createPathSolution(createUserSubmissionDto);
        console.log(pathSolutionDir)

        // if checks if above dir exist
        let dirExist = this.userSubmissionFileHandler.checkDirExist(pathSolutionDir);
        if (!dirExist){
            // if not -- create this dir
            await FileHandlingService.createNewDir(pathSolutionDir);
        }

        // uploading single file to directory
        await this.userSubmissionFileHandler.uploadFile(createUserSubmissionDto,file);
        
        // get list of all files in dir solution to update list of files in submission info
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto)
        

        // assigning files info to db
        createUserSubmissionDto.submittedFiles = filesInDirSolution;
        
        
        // object tha will be stored in db
        console.log(createUserSubmissionDto);


        let currentTime = new Date();
        //let createdUserSubmission = new this.userSubmissionModel(createUserSubmissionDto);
        
        if (dirExist) {
            const filter = { 
                studentId: createUserSubmissionDto.studentId,
                major: createUserSubmissionDto.major,
                module: createUserSubmissionDto.module,
                subject: createUserSubmissionDto.subject
            
            };
            
            const update = { 
                submittedFiles: createUserSubmissionDto.submittedFiles,
                submittedTimeStamp: currentTime
                
            };
            
            let updatedSubmissionOfUser = await this.userSubmissionModel.findOneAndUpdate(filter, update, {
            new: true
            });
            return updatedSubmissionOfUser;
        } else {
            
            createUserSubmissionDto.submittedTimeStamp = currentTime;
            return await this.userSubmissionModel.create(createUserSubmissionDto);
        }
    }

    async getUserSubmissionByKey(id: string, major: Major, module: string, subject: string) {

        const filter = { 
            sodlierId: id,
            major: major,
            module: module,
            subject: subject
        };

        let userSubmission = await this.userSubmissionModel.findOne(filter);

        if (userSubmission) {
            return userSubmission;

        } else {

            throw new HttpException("The user-submission object is not found", HttpStatus.NOT_FOUND);
        }
    }
}
