import { Major } from "src/server/users/common/major.enum";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

// Manager resposible for handling operations on major level
export class MajorManager {
    

    // deletes directory & its content on major level
    async deleteMajorDir(directory_name_delete : Major) {
    
        let fs = require('fs');
        let deleteMajorDir = this.createPathMajor(directory_name_delete);
        
        return await new Promise((resolve, reject) => {

                // all sub folders too
                fs.rmdir(deleteMajorDir, {recursive:true}, function(err) {
                if (err) { 

                    reject(err);
                } else {
          
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
        let allModules =  FileHandlingService.getDirList(fullPath);
        
        
        const transform = k => {

            return parseInt(k.split(IndexingFormat.ModuleSeparator)[0])
        }
        // sort by subindexing to preserve order in front
        if (allModules !== undefined){
            
            allModules.sort(function (a,b){
            
                return transform(a) - transform(b);
            });
        }

        
        return allModules
    }

    // creates directory on major level
    async createNewMajorDir(directory_name : String){
        
            let fs = require('fs');
            let dirRoot = FileHandlingService.pathRootDirectory;
    
            let newMajorDir = dirRoot + '/' + directory_name;
            
            return await new Promise ((resolve, reject) => {
    
                fs.mkdir(newMajorDir, function(err) {
                    if (err) {

                        reject(err);
                        
    
                    } else {
    
                        resolve(newMajorDir);
                    }
                });
            })
    }



}
  
