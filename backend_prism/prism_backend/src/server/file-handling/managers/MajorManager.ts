import { Major } from "src/server/users/common/major.enum";
import { FileHandlingService } from "../file-handling.service";

export class MajorManager {
    

    // deletes directory & its content on major level
    async deleteMajorDir(directory_name_delete : Major){
    
        let fs = require('fs');
        let deleteMajorDir = this.createPathMajor(directory_name_delete)
        
        return await new Promise( (resolve, reject) => {

        
                fs.rmdir(deleteMajorDir, {recursive:true}, function(err) {
                if (err) { 
                    console.log("here");
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Directory " + deleteMajorDir + " was deleted");
                    resolve(deleteMajorDir);
                }
            });
        })
    }

    // composes root/MAJOR
    createPathMajor(major:Major){
            let path = FileHandlingService.pathRootDirectory;
            let pathMajor = path + '/' + major
            return pathMajor;
    }

    async getAllDirOfMajor(major:Major) {
        let fullPath = this.createPathMajor(major);
        return FileHandlingService.getDirList(fullPath);
    }

    // creates directory on major level
    async createNewMajorDir(directory_name : String){
        
            let fs = require('fs');
            let dirRoot = FileHandlingService.pathRootDirectory;
    
            let newMajorDir = dirRoot + '/' + directory_name;
            
            return await new Promise ((resolve, reject) => {
    
                fs.mkdir(newMajorDir, function(err) {
                    if (err) {
                        console.log("here");
                        console.log(err);
                        reject(err);
                        
    
                    } else {
    
                        console.log("New directory " +  newMajorDir + " successfully created.");
                        resolve(newMajorDir);
                    }
                });
            })
    }



}
  
