import { IndexingFormat } from "src/server/file-handling/common/IndexingFormat";
import { FileHandlingService } from "src/server/file-handling/file-handling.service";
import { Major } from "src/server/users/common/major.enum";
import { UserSubmissionDTO } from "src/server/users/dto/user-submission.dto";

export class UserSubmissionFileHandler {

    fileHandlerService:FileHandlingService

    constructor(){
        this.fileHandlerService = new FileHandlingService()
    }
  
    checkDirExist(pathSolutionDir:string){
        const fs = require("fs"); // Or `import fs from "fs";` with ESM
        if (!fs.existsSync(pathSolutionDir)) {
            console.log("Solution dir alredy exist")
            return false    
        }
        console.log("Solution dir not  exist")
        return true 
    }


    uploadFile(createUserSubmissionDto: UserSubmissionDTO,file){
        let major_choosen = createUserSubmissionDto.major
        let module_choosen = createUserSubmissionDto.module
        let subject_choosen = createUserSubmissionDto.subject


        let newSubject = subject_choosen + "/" + createUserSubmissionDto.studentId + IndexingFormat.SoldierSolutionSeparator

        console.log(major_choosen)

        return this.fileHandlerService.uploadFile(file,major_choosen, module_choosen, newSubject);
    }


    getFiles(createUserSubmissionDto: UserSubmissionDTO,){
        let major = createUserSubmissionDto.major
        let module = createUserSubmissionDto.module
        let subject = createUserSubmissionDto.subject

        let postFix = createUserSubmissionDto.studentId + IndexingFormat.SoldierSolutionSeparator
        let newSubject = subject + "/" + postFix
        
        
        let allFilesInSolution =  this.fileHandlerService.getAllFilesOfPath(major,module,newSubject)
        return allFilesInSolution
    }


    createPathSolution(createUserSubmissionDto: UserSubmissionDTO){
        
        
        let major:Major
        let module:string, subject:string, soldierId:string

        major = createUserSubmissionDto.major
        module = createUserSubmissionDto.module
        subject = createUserSubmissionDto.subject
        soldierId = createUserSubmissionDto.studentId



        
        let path = FileHandlingService.pathRootDirectory;
        let pathSubject = path + '/' + major + '/' + module + '/' + subject;


        let soldier_postix =  soldierId + IndexingFormat.SoldierSolutionSeparator 

        let pathOfSoldierSolutionDir = pathSubject + "/" + soldier_postix
        return pathOfSoldierSolutionDir

    }



}