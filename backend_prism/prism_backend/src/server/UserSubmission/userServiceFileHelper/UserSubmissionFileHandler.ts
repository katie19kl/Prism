import { IndexingFormat } from '../../file-handling/common/IndexingFormat';
import { FileHandlingService } from "src/server/file-handling/file-handling.service";
import { FileManager } from "src/server/file-handling/managers/FileManager";
import { Major } from "src/server/users/common/major.enum";
import { UserSubmissionDTO } from "../dto/user-submission.dto";

// File handler to user submission cases
export class UserSubmissionFileHandler {

    fileManager: FileManager;

    constructor(){
        this.fileManager = new FileManager()
    }
  
    checkDirExist(pathSolutionDir:string){
        const fs = require("fs"); // Or `import fs from "fs";
        if (!fs.existsSync(pathSolutionDir)) {
            console.log("Solution dir not exist")
            return false    
        }
        console.log("Solution dir already  exist")
        return true 
    }


    createPathToSolutionDir(createUserSubmissionDto: UserSubmissionDTO){

        let subject_choosen = createUserSubmissionDto.subject
        let newSubject = subject_choosen + "/" + createUserSubmissionDto.soldierId + IndexingFormat.SoldierSolutionSeparator

        return newSubject
    }


    uploadFile(createUserSubmissionDto: UserSubmissionDTO,file){

        let major_choosen = createUserSubmissionDto.major
        let module_choosen = createUserSubmissionDto.module
        let newSubject = this.createPathToSolutionDir(createUserSubmissionDto)

        return this.fileManager.uploadFile(file,major_choosen, module_choosen, newSubject);
    }


    async getFiles(createUserSubmissionDto: UserSubmissionDTO,){
        let major = createUserSubmissionDto.major
        let module = createUserSubmissionDto.module
        let subject = createUserSubmissionDto.subject

        let postFix = createUserSubmissionDto.soldierId + IndexingFormat.SoldierSolutionSeparator
        let newSubject = subject + "/" + postFix
        
        
        let allFilesInSolution;
        
            
        allFilesInSolution =  await this.fileManager.getAllFilesOfPath(major,module,newSubject)
        return allFilesInSolution
      
        
    
    }


    createPathSolution(createUserSubmissionDto: UserSubmissionDTO){
        
        
        let major:Major
        let module:string, subject:string, soldierId:string

        major = createUserSubmissionDto.major
        module = createUserSubmissionDto.module
        subject = createUserSubmissionDto.subject
        soldierId = createUserSubmissionDto.soldierId



        
        let path = FileHandlingService.pathRootDirectory;
        let pathSubject = path + '/' + major + '/' + module + '/' + subject;


        let soldier_postix =  soldierId + IndexingFormat.SoldierSolutionSeparator 

        let pathOfSoldierSolutionDir = pathSubject + "/" + soldier_postix
        return pathOfSoldierSolutionDir

    }



    deleteFile(createUserSubmissionDto: UserSubmissionDTO, file_name){

        let major_choosen = createUserSubmissionDto.major
        let module_choosen = createUserSubmissionDto.module
        let newSubjectPath = this.createPathToSolutionDir(createUserSubmissionDto)
        

       return this.fileManager.deleteFile(major_choosen, module_choosen, newSubjectPath, file_name)
        

    }


}