import { HttpService } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";


import { Major } from "src/server/users/common/major.enum";
import { IndexingFormat } from "../common/IndexingFormat";
import { FileHandlingService } from "../file-handling.service";

export class ModuleManager {






    async removeModuleDirInMajor(module_to_del: string, major: Major) {
   
      
        let dir = this.createPathMajorModuleGivenIndexing(major, module_to_del)

        
        const fs = require("fs")


        
        return await new Promise((resolve,reject) =>{
            
          
            

            if (fs.existsSync(dir)){

                fs.rmdir(dir, { recursive: true }, async (err) => {
                
                    
                    if (err) {
        
                        reject(new NotFoundException("Deleting problem"))
                    }
                    else {
                        
        
             
                        
                        let removedIndex = this.getModuleIndexFromModule(module_to_del)
                            
                        let renaming = await this.decreaseIndexesModulesAfterRemoved(removedIndex, major)

     
                        

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

        }) 




    }
    
    createPathMajorModuleGivenIndexing(major: Major, module: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module;
        return pathMajor;
    }


    async getAllDirOfModule(major: Major, module: string) {
        let fullPath = this.createPathMajorModuleGivenIndexing(major, module);

        
        let allSubjects = FileHandlingService.getDirList(fullPath);
        

        

        const transform = k => {

            return parseInt(k.split(IndexingFormat.SubjectSeparator)[0].split(IndexingFormat.SubjectSubIndexing)[1])
        }
        // sort by subindexing
        allSubjects.sort(function (a,b){
           
            return transform(a) - transform(b);
        });

        
        
        return allSubjects
    }

    getModuleIndexFromModule(moduleName){
   
        return moduleName.split(IndexingFormat.ModuleSeparator)[0]
    }



    async decreaseModuleIndexInSubjects(major:Major, module, removedIndex){

    }



    async decreaseIndexesModulesAfterRemoved(removedIndex, major: Major) {

        const fs = require("fs")
    
        
        let path = this.createPathMajor(major)
        let all_dirs = FileHandlingService.getDirList(path)

        

        return await new Promise( async (res, rej) => {

            for await (const dir_module of all_dirs) {

                let dirIndex = this.getModuleIndexFromModule(dir_module)


           
                
                let index_dir = parseInt(dirIndex)
                if (index_dir > removedIndex) {
          
                    
    
                    let currentPath = path + "/" + dir_module;
                    let index_new = parseInt(dirIndex) - 1
                    
                    
       
                    
                    
                    let leftPart = dir_module.split(IndexingFormat.ModuleSeparator)[0]
                    let rightPart = dir_module.split(IndexingFormat.ModuleSeparator)[1]
                    let newLeftPart = leftPart.replace(index_dir,index_new.toString())
                    let dirNew = newLeftPart + IndexingFormat.ModuleSeparator + rightPart 


                    let newPath = path + "/" + dirNew
    


                    // Here can rename all subjects inside module
                    fs.rename(currentPath, newPath, function (err) {
                        if (err) {
                            rej(-1)
                        }

                       
                        
                        let all_dirs_subject = FileHandlingService.getDirList(newPath)

                        for (const dir_subject of all_dirs_subject){


                            let indexNew = (parseInt(dir_subject.split(IndexingFormat.SubjectSubIndexing)[0]) - 1).toString()
                            let indexPrev = parseInt(dir_subject.split(IndexingFormat.SubjectSubIndexing)[0]).toString()
                          
                            
                            let new_dir_subject = newPath + "/" + indexNew + dir_subject.substring(indexPrev.length)
                            let prev_dir_subject = newPath + "/" +indexPrev +  dir_subject.substring(indexPrev.length)

                  
                            

                            fs.rename(prev_dir_subject, new_dir_subject, function (err) {
                                if (err) {
                                    rej(-1)
                                }
                            })
   
                        }
                    
                        
                    })
                }
            }


            res(all_dirs)
    
        })

    }


    createPathMajor(major: Major) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major
        return pathMajor;
    }




    async getIndexOfLastModule(major: Major) {

        let fs = require('fs');
        let dirMajor = FileHandlingService.pathRootDirectory + "/" + major


        let dirs_in_major: any[] = await new Promise((resolve, reject) => {

            let dirs = []
            fs.readdir(dirMajor, async (err, files) => {

                if (err) {
                    reject(err);
                }
                for await (const file of files) {
                    const stat = await fs.promises.stat(dirMajor + "/" + file);
                    if (await stat.isDirectory()) {
                        dirs.push[file];
                    }
                }
                resolve(files)
            });

        })

        let amount_modules = 0
        for (const foo of dirs_in_major) {
            amount_modules = amount_modules + 1
        }
        return amount_modules



    }


    nameModuleExist(new_directory_name: string, major: Major, lastIndex) : boolean{
        
        const fs = require("fs");
        for (let i = 0; i<lastIndex; i= i + 1){
        
            let pathMajor = this.createPathMajor(major)
            let pathModuleNew = this.createPathMajorModule(i.toString(), pathMajor, new_directory_name)
            

            
            if (fs.existsSync(pathModuleNew)) {
 

                return true;        
            }
        }
        return false

        
    }

    // creates directory in major level
    async createNewModuleDirInMajor(new_directory_name: string, major: Major) {
        let lastIndex = await this.getIndexOfLastModule(major) + 1
        let pathMajor = this.createPathMajor(major)
        




        let pathModuleNew = this.createPathMajorModule(lastIndex.toString(), pathMajor, new_directory_name)
       
        let alreadyExist = this.nameModuleExist(new_directory_name, major,lastIndex)

        if (alreadyExist){
            pathModuleNew = "undefined"
        }


        return await FileHandlingService.createNewDir(pathModuleNew)

    }


   


    //composes root/major/model of given module index
    createPathMajorModule(module_index: string, pathMajor, new_module: string) {


        //let dirsInMajor = FileHandlingService.getDirList(pathMajor)
        //let nameOfIndexedDir = this.getNameOfIndexedDirModule(dirsInMajor, module_index);
      


        let pathMajorModel = pathMajor + "/" + module_index + IndexingFormat.ModuleSeparator + new_module;
        return pathMajorModel;

    }

    // given list of all dirs in some module path
    // return name with given index
    getNameOfIndexedDirModule(dirsInMajor, module_index: String) {

        let index = '';
        let nameOfIndex = '';

        for (let dir of dirsInMajor) {
            let tokenedDir = dir.split(IndexingFormat.ModuleSeparator)
            // parse dir index & name
            if (tokenedDir.length == 2) {
                
                index = tokenedDir[0]
                nameOfIndex = tokenedDir[1]

            }
            // desired index was found
            if (index === module_index) {
                return nameOfIndex;
            }


        }

        return " "
    }

    getIndexFromName(moduleName:string){
        //let index_prefix = moduleName[0] + IndexingFormat.ModuleSeparator
        let index_prefix = this.getModuleIndexFromModule(moduleName) + IndexingFormat.ModuleSeparator

        return index_prefix
    }





 






    async renameModule(major: Major, currentModuleName:string, newModuleName:string){
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let currPath = this.createPathMajorModuleGivenIndexing(major, currentModuleName)
        

        let moduleIndex = this.getIndexFromName(currentModuleName)

        
        let newPath = this.createPathMajorModuleGivenIndexing(major, moduleIndex + newModuleName)
        
        let lastIndex = await this.getIndexOfLastModule(major) + 1

        let existAlready = this.nameModuleExist(newModuleName, major, lastIndex)
        
        if (existAlready){
            newPath = "undefined"
            
        }


        

        

        const fs = require("fs")
        return await new Promise((resolve,reject) =>{
            if (newPath === "undefined"){
                reject(new ConflictException("Provided name already exist"))
            }
            else {
                
                fs.rename(currPath, newPath, function (err) {
                    if (err) {
                        
                        reject(new NotFoundException("Provided directory was not found"))
                        
                    } else {
                        
                      
                        resolve("Successfully renamed the directory")
                        
                        
                    }
                })
            }

        }); 
    }



}