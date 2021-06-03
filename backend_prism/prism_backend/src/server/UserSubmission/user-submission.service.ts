import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSubmissionSchema } from './userSubmission.schema';
import { UserSubmissionDTO } from './dto/user-submission.dto';
import { IUserSubmission } from './iuser-submission.interface';
import { FileHandlingService } from '../file-handling/file-handling.service';
import { UserSubmissionFileHandler } from './userServiceFileHelper/userSubmissionFileHandler';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from '../RolesActivity/constants';
import { resolve } from 'node:path';
import { Major } from '../users/common/major.enum';


@Injectable()
export class UserSubmissionService {

    userSubmissionFileHandler: UserSubmissionFileHandler;


    // Model<IUserSubmission> ---- Broker  between DB & ME
    constructor(@InjectModel('User-Submission') private userSubmissionModel: Model<IUserSubmission>)   
    {
        this.userSubmissionFileHandler = new UserSubmissionFileHandler()
    }

    // retrieve personal id, where token is given
    static getIdFromJWT(usertoken){

        let jwt = require('jsonwebtoken');
	
		const token = usertoken.split(' ');
		
		// decode JWT & retrieve personalID
        console.log(" -------------------------------");

		const decoded = jwt.verify(token[1], jwtConstants.secret);
		let personalId = decoded['personalId'];

        console.log(personalId);

        return personalId;
    }


    async getUserSubmissionByKey(id: string, major: Major, module: string, subject: string) {
        
        
        //////////////// SUKA WHY MAJOR ARRAY ???? ////////////////
        
        console.log("1")
        const filter = { 
            soldierId: id,
            major: major,
            module: module,
            subject: subject
        };
        console.log("2")
        let result = await this.userSubmissionModel.findOne(filter);
        console.log(result)

        console.log(filter)
        console.log("3")
        if (result) {
            console.log("4")
            return result;
        
        } else {
            console.log("5")
            throw new HttpException("No submission has been made by the soldier", HttpStatus.NOT_FOUND);
        } 
    }

    // removes from file root & removes from db only one file
    async removeSubmittedFile(createUserSubmissionDto: UserSubmissionDTO, usertoken, file_name){
        
        let userId = UserSubmissionService.getIdFromJWT(usertoken)
        //let userId = "12345678"
        createUserSubmissionDto.soldierId = userId
 
        // delete file from directory
        let deletedFromDir = await this.userSubmissionFileHandler.deleteFile(createUserSubmissionDto, file_name)
        
        // get new file list - currently presented in solution dir
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto)
        

        // update db with currentl file list 
        let updatedInDB = await this.updateUserSubmissionDB(createUserSubmissionDto, usertoken,filesInDirSolution)        
    

        return updatedInDB
    }


    // puts new files & date of submission
    async updateUserSubmissionDB(createUserSubmissionDto: UserSubmissionDTO, usertoken, filesToUpdate){

        const filter = { 
            soldierId: UserSubmissionService.getIdFromJWT(usertoken),
            //soldierId: "12345678",
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        };
      
      
        createUserSubmissionDto.submittedFiles = filesToUpdate;
        

        createUserSubmissionDto = this.updateCurrentTime(createUserSubmissionDto)


        
        const update = { 
            submittedFiles: filesToUpdate,
            submittedTime: createUserSubmissionDto.submittedTime,
            submittedDate: createUserSubmissionDto.submittedDate,
            
        };
        

        let updatedSubmissionOfUser =  await this.userSubmissionModel.findOneAndUpdate(filter, update, {
        new: true
        });
        return updatedSubmissionOfUser;

    }

    // сhecks if document in db already exist
    async checkDocExist(createUserSubmissionDto, idFromJWT){
        const filter = { 
            soldierId: idFromJWT,
            major: createUserSubmissionDto.major,
            module: createUserSubmissionDto.module,
            subject: createUserSubmissionDto.subject
        
        };
        
        let docExist =  this.userSubmissionModel.exists(filter);
        return docExist
    }


    updateCurrentTime(createUserSubmissionDto: UserSubmissionDTO){
        createUserSubmissionDto.submittedTime = new Date().toLocaleTimeString(); // 11:18:48 AM

        createUserSubmissionDto.submittedDate = new Date().toLocaleDateString(); // 11/16/2015

        return createUserSubmissionDto
    }
   

    /// take care of adding to empty folder
    async addNewUserSubmission(createUserSubmissionDto: UserSubmissionDTO, file, usertoken) {
        
        createUserSubmissionDto.isChecked = false


        let idFromJWT = UserSubmissionService.getIdFromJWT(usertoken)
        //let idFromJWT = "12345678"
        
        createUserSubmissionDto.soldierId = idFromJWT
        // dir with user solutions
        let pathSolutionDir = this.userSubmissionFileHandler.createPathSolution(createUserSubmissionDto);
        
        // if checks if above dir exist
        let dirExist = this.userSubmissionFileHandler.checkDirExist(pathSolutionDir);
        if (!dirExist) {

            // if not -- create this dir
            await FileHandlingService.createNewDir(pathSolutionDir);
        }

        // uploading single file to directory
        await this.userSubmissionFileHandler.uploadFile(createUserSubmissionDto,file);
        
        // get list of all files in dir solution to update list of files in submission info
        let filesInDirSolution = await this.userSubmissionFileHandler.getFiles(createUserSubmissionDto);
        

        
        let docExist = await this.checkDocExist(createUserSubmissionDto, idFromJWT)

        if (docExist){
  
            let updatedSubmissionOfUser = this.updateUserSubmissionDB(createUserSubmissionDto, usertoken,filesInDirSolution)

            return await updatedSubmissionOfUser
        }else {
            
            // assigning files info to db
            createUserSubmissionDto.submittedFiles = filesInDirSolution;


            createUserSubmissionDto = this.updateCurrentTime(createUserSubmissionDto)
            return await this.userSubmissionModel.create(createUserSubmissionDto)
        }
    }


    async getAllSoldierSubmissions(personalId:string, major_:Major, module_:string){
                //////////////// SUKA WHY MAJOR ARRAY ???? ////////////////
        
            const filter = { 
                    soldierId: personalId,
                    major: major_,
                    module: module_,
            };
            //console.log("2")
            let result = await this.userSubmissionModel.find(filter);
            return result;

    }

}