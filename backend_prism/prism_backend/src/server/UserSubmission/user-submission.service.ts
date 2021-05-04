import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { UserSubmissionSchema } from './userSubmission.schema';
import { UserSubmissionDTO } from './../users/dto/user-submission.dto';
import { IUserSubmission } from './iuser-submission.interface';
import { FileHandlingService } from '../file-handling/file-handling.service';

import { UserSubmissionFileHandler } from './userServiceFileHelper/userSubmissionFileHandler';
import { AuthService } from '../auth/auth.service';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from '../RolesActivity/constants';
import { UserSubmissionDBHandler } from './userServiceFileHelper/UserSubmissionDBHandler';
import { resolve } from 'node:path';


@Injectable()
export class UserSubmissionService {

    userSubmissionFileHandler: UserSubmissionFileHandler;
    userSubmissionDBHandler:UserSubmissionDBHandler

    // Model<IUserSubmission> ---- Broker  between DB & ME
    constructor(@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>)
    
    {


        this.userSubmissionFileHandler = new UserSubmissionFileHandler()
        this.userSubmissionDBHandler = new UserSubmissionDBHandler(userSubmissionModel)

          //this.majorManager = new MajorManager()
        
    }

    static getIdFromJWT(usertoken){

        let jwt = require('jsonwebtoken')
	
		const token = usertoken.split(' ');
		
		// decode JWT & retrieve personalID
        console.log(" -------------------------------")
		const decoded = jwt.verify(token[1], jwtConstants.secret);
		let personalId = decoded['personalId'];
        console.log(personalId);
        return personalId
    }


  

    async removeSubmittedFile(createUserSubmissionDto: UserSubmissionDTO, usertoken, file_name){
        
        let userId = UserSubmissionService.getIdFromJWT(usertoken)
        createUserSubmissionDto.studentId = userId

        console.log("1")
        let deletedFromDir = await this.userSubmissionFileHandler.deleteFile(createUserSubmissionDto, file_name)
        
        console.log("2")
        console.log(deletedFromDir)
        
        console.log("3")

        
            
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto)
    
        console.log(filesInDirSolution)
        //let updatedInDB = await this.updateUserSubmissionDB(createUserSubmissionDto, usertoken,filesInDirSolution)        
        
        console.log("4")
        //console.log(updatedInDB)
        return "xui"
    }



    updateUserSubmissionDB(createUserSubmissionDto: UserSubmissionDTO, usertoken, filesToUpdate){

        const filter = { 
            studentId: UserSubmissionService.getIdFromJWT(usertoken),
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        
        };
      
      
        createUserSubmissionDto.submittedFiles = filesToUpdate;
        
        let currentTime = new Date()
        const update = { 
            submittedFiles: filesToUpdate,
            submittedTimeStamp: currentTime
            
        };
        

        let updatedSubmissionOfUser =  this.userSubmissionModel.findOneAndUpdate(filter, update, {
        new: true
        });
        return updatedSubmissionOfUser

    }







    async addNewUserSubmission(createUserSubmissionDto: UserSubmissionDTO, file, usertoken) {

        let idFromJWT = UserSubmissionService.getIdFromJWT(usertoken)
        createUserSubmissionDto.studentId = idFromJWT
        // dir with user solutions
        let pathSolutionDir = this.userSubmissionFileHandler.createPathSolution(createUserSubmissionDto)
        
        // if checks if above dir exist
        let dirExist = this.userSubmissionFileHandler.checkDirExist(pathSolutionDir);
        if (!dirExist){
            // if not -- create this dir
            await FileHandlingService.createNewDir(pathSolutionDir)
        }

        // uploading single file to directory
        await this.userSubmissionFileHandler.uploadFile(createUserSubmissionDto,file)
        
        // get list of all files in dir solution to update list of files in submission info
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto)
        

        // assigning files info to db
        createUserSubmissionDto.submittedFiles = filesInDirSolution;
        
        
    

        let currentTime = new Date()
        
        if (dirExist){
            const filter = { 
                studentId: idFromJWT,
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
            return updatedSubmissionOfUser
        }else {
            
            
            createUserSubmissionDto.submittedTimeStamp = currentTime
            return await this.userSubmissionModel.create(createUserSubmissionDto)
        }

        
        

    }

}
