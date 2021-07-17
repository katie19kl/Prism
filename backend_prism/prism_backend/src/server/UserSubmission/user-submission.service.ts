import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSubmissionDTO } from './dto/user-submission.dto';
import { IUserSubmission } from './iuser-submission.interface';
import { FileHandlingService } from '../file-handling/file-handling.service';
import { UserSubmissionFileHandler } from './userServiceFileHelper/userSubmissionFileHandler';
import { jwtConstants } from '../RolesActivity/constants';
import { Major } from '../users/common/major.enum';


@Injectable()

// Handles user submission operation
export class UserSubmissionService {

    userSubmissionFileHandler: UserSubmissionFileHandler;


    // Model<IUserSubmission> ---- Broker  between DB & ME
    constructor(@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>) {
        this.userSubmissionFileHandler = new UserSubmissionFileHandler()
    }


    // retrieve personal id, where token is given
    static getIdFromJWT(usertoken){

        let jwt = require('jsonwebtoken');
		const token = usertoken.split(' ');
		
		const decoded = jwt.verify(token[1], jwtConstants.secret);
		let personalId = decoded['personalId'];

        return personalId;
    }


    async getUserSubmissionByKey(id: string, major: Major, module: string, subject: string) {
                
        const filter = { 
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };

        let result = await this.userSubmissionModel.findOne(filter);

        if (result) {
            return result;
        
        } else {
            throw new HttpException("No submission has been made by the soldier", HttpStatus.NOT_FOUND);
        } 
    }


    async getUserSubmission(id: string) {
                
        const filter = { 
            soldierId: id
        };

        let result = await this.userSubmissionModel.find(filter);

        if (result) {
            return result;
        
        } else {
            throw new HttpException("No submission has been made by the soldier", HttpStatus.NOT_FOUND);
        } 
    }

    // removes from file root & removes from db only one file
    async removeSubmittedFile(createUserSubmissionDto: UserSubmissionDTO, usertoken, file_name) {
        
        let userId = UserSubmissionService.getIdFromJWT(usertoken);
        createUserSubmissionDto.soldierId = userId;
 
        // delete file from directory
        await this.userSubmissionFileHandler.deleteFile(createUserSubmissionDto, file_name);
        
        // get new file list - currently presented in solution dir
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto);
        
        // update db with currentl file list 
        let updatedInDB = await this.updateUserSubmissionDB(createUserSubmissionDto, usertoken,filesInDirSolution)   ;     
    
        return updatedInDB;
    }


    // puts new files & date of submission
    async updateUserSubmissionDB(createUserSubmissionDto: UserSubmissionDTO, usertoken, filesToUpdate) {

        const filter = { 
            soldierId: UserSubmissionService.getIdFromJWT(usertoken),
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        };
      
        createUserSubmissionDto.submittedFiles = filesToUpdate;
        createUserSubmissionDto = this.updateCurrentTime(createUserSubmissionDto);
        
        const update = { 
            submittedFiles: filesToUpdate,
            submittedTime: createUserSubmissionDto.submittedTime,
            submittedDate: createUserSubmissionDto.submittedDate,
        };
        
        let updatedSubmissionOfUser =  await this.userSubmissionModel.findOneAndUpdate(filter, update, { new: true });
        return updatedSubmissionOfUser;
    }


    // сhecks if document in db already exist
    async checkDocExist(createUserSubmissionDto, idFromJWT) {

        const filter = { 
            soldierId: idFromJWT,
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        };
        
        let docExist =  await this.userSubmissionModel.exists(filter);
        return docExist;
    }


    updateCurrentTime(createUserSubmissionDto: UserSubmissionDTO){
        createUserSubmissionDto.submittedTime = new Date().toLocaleTimeString();
        createUserSubmissionDto.submittedDate = new Date().toLocaleDateString();

        return createUserSubmissionDto;
    }
   

    /// take care of adding to empty folder
    async addNewUserSubmission(createUserSubmissionDto: UserSubmissionDTO, file, usertoken) {
        

        createUserSubmissionDto.gradeDescription = "";
        createUserSubmissionDto.isChecked = false;

        let idFromJWT = UserSubmissionService.getIdFromJWT(usertoken);
                
        createUserSubmissionDto.soldierId = idFromJWT;

        // dir with user solutions
        let pathSolutionDir = this.userSubmissionFileHandler.createPathSolution(createUserSubmissionDto);
        
        // if checks if above dir exist (sync)
        let dirExist = this.userSubmissionFileHandler.checkDirExist(pathSolutionDir);

        if (!dirExist) {

            // if not -- create this dir
            await FileHandlingService.createNewDir(pathSolutionDir);
        }

        // uploading single file to directory
        await this.userSubmissionFileHandler.uploadFile(createUserSubmissionDto, file);
        
        // get list of all files in dir solution to update list of files in submission info
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto);
        
        let docExist = dirExist;

        if (docExist) {

            let updatedSubmissionOfUser = this.updateUserSubmissionDB(createUserSubmissionDto,
                usertoken, filesInDirSolution);

            return await updatedSubmissionOfUser;

        } else {
            
            // assigning files info to db
            createUserSubmissionDto.submittedFiles = filesInDirSolution;
            createUserSubmissionDto = this.updateCurrentTime(createUserSubmissionDto);

            return await this.userSubmissionModel.create(createUserSubmissionDto);
        }
    }


    async getAllSoldierSubmissions(personalId: string, major_: Major, module_: string) {
                
        const filter = { 
            soldierId: personalId,
            major: major_,
            module: module_,
        };
        
        let result = await this.userSubmissionModel.find(filter);
        return result;
    }


    async getAllSubmissionsByMajor(major_: Major) {

        const filter = { major: major_ };

        return await this.userSubmissionModel.find(filter);
    }
}