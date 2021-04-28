import { NotFoundException } from "@nestjs/common";
import { Major } from "src/server/users/common/major.enum";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

export class SubjectManager{


    createPathToModule(major,module){
        let pathToModule = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        return pathToModule
    }

    async getLastIndexOfSubject(pathToModule){

        console.log(pathToModule)
        const fs = require('fs');

        let all_subjects = []

        await new Promise ((resolve, reject) => {
            fs.readdir(pathToModule, async (err, files) => {
                        
                        
                if (err) {
                    console.log("1")
                    reject(new NotFoundException("This sub-directory is not found"));
                }
                else {
                    for await(const file of files){
                        console.log("2")
                        const stat = await fs.promises.stat( pathToModule + "/" + file);
                        if (await stat.isDirectory()) {
                            all_subjects.push(file)
                        }
                    }
                }
            
                resolve(files)
            });
        })

        console.log(all_subjects)
        
        let amount = all_subjects.length

        return amount
        
    }
    createSubjectPathDir(major:Major,module: string,newNameSubject: string, new_index:string){

        let indexModule = module[0]
        let pathMajorModelSubject = FileHandlingService.pathRootDirectory + "/" + major + '/'  + module+ "/"+ indexModule + IndexingFormat.SubjectSubIndexing + new_index + IndexingFormat.SubjectSeparator + newNameSubject
        return pathMajorModelSubject
    }

    async createNewSubject(major:Major,module: string,newNameSubject: string)
    {   
 
        let pathToModule = this.createPathToModule(major,module)

        console.log(pathToModule)
        let lastSubjectIndex = await this.getLastIndexOfSubject(pathToModule)
        
        let newIndex = (lastSubjectIndex + 1).toString()
        let dirPath = this.createSubjectPathDir(major,module,newNameSubject,newIndex)


        return  await FileHandlingService.createNewDir(dirPath)
        
    }


    concateSubjectPath(major:Major, module:string, subject:string){
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" +  module + "/" + subject
        return path
    }


    extractIndexOfSubject(subjectToDelete){
        let splittedIndexing = subjectToDelete.split(IndexingFormat.SubjectSubIndexing)
        if (splittedIndexing !== undefined){
            let subjectIndex = splittedIndexing[1][0]
            
            return subjectIndex
        } 
        return " "
    }



    async decreaseIndexesSubjectAfterRemoved(removedIndex:string, major:Major, module:string){
        
        const fs = require("fs")
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        
        let all_dirs = FileHandlingService.getDirList(path)
        console.log(all_dirs)


        
        return await new Promise( async (resolve, reject) =>{
            for await (const dir of all_dirs) {
         
                let index_dir = this.extractIndexOfSubject(dir)
       
                if (parseInt(index_dir) > parseInt(removedIndex)) {
    
                    console.log(dir)
    
                    let currentPath = path + "/" + dir;
                    let index_new = parseInt(dir[2]) - 1
                    let dirNew = dir.replace(dir[2], index_new.toString());
                    let newPath = path + "/" + dirNew
    
                    
                    fs.rename(currentPath, newPath, function (err) {
                        if (err) {
                            reject(-1)
                        } 
                    })
                }
            }
            resolve(all_dirs)
        })
 


    }
    




    async removeSubject(major: Major, module: string, subjectToDelete: string) {


        //let dir = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_to_del
        let dir = this.concateSubjectPath(major, module, subjectToDelete)
        console.log(dir)
        const fs = require("fs")

        let indexToRemove = this.extractIndexOfSubject(subjectToDelete)
        console.log(indexToRemove)

        console.log(" before rem")
        return await new Promise((resolve,reject) =>{
            
            console.log(fs.existsSync(dir))

            if (fs.existsSync(dir)){
                
                fs.rmdir(dir, { recursive: true }, async (err) => {
                console.log(dir)
                if (err) {
        
                    reject(new NotFoundException("Deleting problem"))
                }
                else {

                    console.log(`${dir} is deleted!`);

                    console.log(" after rem")


                    let renaming =  await this.decreaseIndexesSubjectAfterRemoved(indexToRemove, major, module)
                    if (renaming == -1){
                        reject(new NotFoundException("Renaming problem"))
                    }
                    else {
                        resolve("Deleting & renaming are done")
                    }
                }
                });
            }else {
                reject(new NotFoundException("Provided directory was not found"))
            }
        });
      


    }


    getCurrIndexing(subjectToRename:string){
        let indexNum = subjectToRename.split(IndexingFormat.SubjectSeparator)[0]

        return indexNum + IndexingFormat.SubjectSeparator
    }



    async renameSubject(major:Major, module:string, subjectToRename:string, newNameForSubject:string){

        let currPath = this.concateSubjectPath(major,module,subjectToRename)

        let indexing = this.getCurrIndexing(subjectToRename)

        let newPath = this.concateSubjectPath(major, module, indexing+newNameForSubject)
        console.log(currPath)
        console.log(newPath)


        
        const fs = require("fs")
        return await new Promise((resolve,reject) =>{

            fs.rename(currPath, newPath, function (err) {
                if (err) {
                    
                    reject(new NotFoundException("Provided directory was not found"))
                    
                } else {
                    
                    resolve("Successfully renamed the directory")
                    
                    
                }
            })

        }); 
    }

}