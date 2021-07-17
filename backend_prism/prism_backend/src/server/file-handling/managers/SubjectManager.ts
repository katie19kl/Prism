import { ConflictException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { SubjectsOnDemandService } from "src/server/subjects-on-demand/subjects-on-demand.service";
import { Synchronizer } from "src/server/synchronizer/Synchronizer";
import { Major } from "src/server/users/common/major.enum";
import { UsersService } from "src/server/users/users.service";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

export class SubjectManager {


    constructor(){}


    createPathToModule(major,module){
        let pathToModule = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        return pathToModule
    }

    async getLastIndexOfSubject(pathToModule){

   
        const fs = require('fs');

        let all_subjects = []

        await new Promise ((resolve, reject) => {
            fs.readdir(pathToModule, async (err, files) => {
                        
                        
                if (err) {
                 
                    reject(new NotFoundException("This sub-directory is not found"));
                }
                else {
                    for await(const file of files){
                        
                        const stat = await fs.promises.stat( pathToModule + "/" + file);
                        if (await stat.isDirectory()) {
                            all_subjects.push(file)
                        }
                    }
                }
            
                resolve(files)
            });
        })

     
        
        let amount = all_subjects.length

        return amount
        
    }
    createSubjectPathDir(major:Major,module: string,newNameSubject: string, new_index:string){

        //let indexModule = module[0]
        
        let indexModule = module.split(IndexingFormat.ModuleSeparator)[0]
       
        let pathMajorModelSubject = FileHandlingService.pathRootDirectory + "/" + major + '/'  + module+ "/"+ indexModule + IndexingFormat.SubjectSubIndexing + new_index + IndexingFormat.SubjectSeparator + newNameSubject
        
        return pathMajorModelSubject
    }


    subjectNameExist(major:Major,module: string,newNameSubject: string,newIndex): boolean{
        const fs = require("fs");
        for (let i = 0; i<newIndex; i = i + 1){

            let dirPath = this.createSubjectPathDir(major,module,newNameSubject,i.toString())
            
  

            if (fs.existsSync(dirPath)) {
  
                return true;        
            }
        }


        return false
    }


    async closeSubjectToEveryone(major:Major,module: string,subject: string,userService:UsersService,  subjectOnDemandService:SubjectsOnDemandService){

        // 1 - get all users of this major
        // 2 - close to everyone this subject
       

        let allSoldiers = await userService.findAllSoldiersInMajor(major)


        for (const soldier of allSoldiers){
            
            let soldierId = soldier["personalId"]

                
            await subjectOnDemandService.closeNewSubjectToSoldier(major,module,subject,soldierId) 

        } 
                  

        //await subjectOnDemandService.closeNewSubjectToAllSoldier(major,module,subject)
    }


    /*
    Creates subject & make it closed to all soldiers
    */
    async createNewSubject(major:Major,module: string,newNameSubject: string, userService:UsersService,
        subjectOnDemandService:SubjectsOnDemandService)
    {   
        
        let pathToModule = this.createPathToModule(major,module)

        let lastSubjectIndex = await this.getLastIndexOfSubject(pathToModule)
        
        let newIndex = (lastSubjectIndex + 1).toString()
        let dirPath = this.createSubjectPathDir(major,module,newNameSubject,newIndex)

        
        let existAlready = this.subjectNameExist(major,module,newNameSubject,parseInt(newIndex))


        
        

        if (existAlready){
            console.log("TAFUS NAHUI")
            dirPath = "undefined"
            return 
        }
        // it will be created =>
        // create it closed  to everyone
        else {
         
           
            let newSubject = this.createNewFinalSubjectName(module, newIndex, newNameSubject)
            await this.closeSubjectToEveryone(major,module ,newSubject,userService, subjectOnDemandService)
        }

        return  await FileHandlingService.createNewDir(dirPath)
        
    
    }


    createNewFinalSubjectName(moduleName, newIndex, subjectName){
        let indexModule = moduleName.split(IndexingFormat.ModuleSeparator)[0]
        let newSubjectName = indexModule + IndexingFormat.SubjectSubIndexing + newIndex + IndexingFormat.SubjectSeparator + subjectName
        return newSubjectName
    }


    concateSubjectPath(major:Major, module:string, subject:string){
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" +  module + "/" + subject
        return path
    }


    extractIndexOfSubject(subjectToDelete){
        let splittedIndexing = subjectToDelete.split(IndexingFormat.SubjectSubIndexing)
        if (splittedIndexing !== undefined){
            //let subjectIndex = splittedIndexing[1][0]
            let subjectIndex = splittedIndexing[1].split(IndexingFormat.SubjectSeparator)[0]
            
            return subjectIndex
        } 
        return " "
    }



    async decreaseIndexesSubjectAfterRemoved(removedIndex:string, major:Major, module:string, syncronizer:Synchronizer){
        
        const fs = require("fs")
        let path = FileHandlingService.pathRootDirectory + "/" + major + "/" + module
        
        let all_dirs = FileHandlingService.getDirList(path)
      
       
        return await new Promise( async (resolve, reject) =>{
            for /*await*/ (const dir_subject of all_dirs) {
         
                let index_dir = this.extractIndexOfSubject(dir_subject)
       
                if (parseInt(index_dir) > parseInt(removedIndex)) {
    
                    let currentPath = path + "/" + dir_subject;
                    //let index_new = parseInt(dir[2]) - 1
                    //let dirNew = dir.replace(dir[2], index_new.toString());
                    let index_new = parseInt(index_dir) - 1

                    // SOLVED : replace problem when name contains numbers
                    let leftPart = dir_subject.split(IndexingFormat.SubjectSubIndexing)[0]
                    let rightPart = dir_subject.split(IndexingFormat.SubjectSubIndexing)[1]
                    let newRightPart = rightPart.replace(index_dir,index_new.toString())
                    let dirNew = leftPart + IndexingFormat.SubjectSubIndexing + newRightPart 

                    
                    let newPath = path + "/" + dirNew
    
                
                    
                    await new Promise((res, rej)=>{
                        fs.rename(currentPath, newPath, async function (err) {
                            if (err) {
                                //reject(-1)
                                rej(-1) 	          
                            }else {
                                console.log("sync renaming", dir_subject, dirNew)
                                await syncronizer.syncSubjectRenaming(major,module,dir_subject, dirNew)
                                console.log(".................................")
                                res(1)
                            }
                        })
                    })

                    /*fs.rename(currentPath, newPath, async function (err) {
                        if (err) {
                            reject(-1) 	          
                        }else {
                            console.log("sync renaming", dir_subject, dirNew)
                            await syncronizer.syncSubjectRenaming(major,module,dir_subject, dirNew)
                            console.log(".................................")
                            
                        }
                    })
                    */
                }
            }
            let all_dirs_ = FileHandlingService.getDirList(path)
            resolve(all_dirs_)
        })
 


    }
    




    async removeSubject(major: Major, module: string, subjectToDelete: string, synchronizer:Synchronizer) {


        //let dir = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_to_del
        let dir = this.concateSubjectPath(major, module, subjectToDelete)
      
        const fs = require("fs")

        let indexToRemove = this.extractIndexOfSubject(subjectToDelete)
        
       

        return await new Promise((resolve,reject) =>{
            
          

            if (fs.existsSync(dir)){
                
                fs.rmdir(dir, { recursive: true }, async (err) => {
        
                if (err) {
        
                    reject(new NotFoundException("Deleting problem"))
                }
                else {

           


                    let renaming =  await this.decreaseIndexesSubjectAfterRemoved(indexToRemove, major, module,synchronizer)
                    if (renaming == -1){
                        reject(new NotFoundException("Renaming problem"))
                    }
                    else {
                        console.log(renaming)
                        console.log("-------in subject after decreasing")
                        await synchronizer.syncSubjectRemoving(major,module,subjectToDelete)
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
        let indexNum = subjectToRename.split(IndexingFormat.ModuleSeparator)[0]
        //let indexNum = this.extractIndexOfSubject(subjectToRename)
       
        return indexNum + IndexingFormat.SubjectSeparator
    }



    async renameSubject(major:Major, module:string, subjectToRename:string, newNameForSubject:string, synchronizer:Synchronizer){

        let pathToModule = this.createPathToModule(major,module)

        let lastSubjectIndex = await this.getLastIndexOfSubject(pathToModule)
        
        let lastIndex = (lastSubjectIndex + 1).toString()



        let currPath = this.concateSubjectPath(major,module,subjectToRename)

        let indexing = this.getCurrIndexing(subjectToRename)

        let newPath = this.concateSubjectPath(major, module, indexing+newNameForSubject)


        

        let alreadyExist = this.subjectNameExist(major,module,newNameForSubject,parseInt(lastIndex)) 
        if (alreadyExist){
          
            newPath = "undefined"
        }

        
        const fs = require("fs")
        return await new Promise( (resolve,reject) =>{

            if (newPath === "undefined"){
                reject(new ConflictException("Provided name already exists!"))
            }
            else {

                fs.rename(currPath, newPath, async function (err) {
                    if (err) {
                        
                        reject(new NotFoundException("Provided directory was not found"))
                        
                    } else {

                      
                        
                        await synchronizer.syncSubjectRenaming(major, module, subjectToRename,indexing + newNameForSubject)

                        resolve("Successfully renamed the directory")

                        
                        
                    }
                })
            }

        }); 
    }

}