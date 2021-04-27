import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/core/injector/module';
import { Major } from '../users/common/major.enum';
import { IndexingFormat } from './common/IndexingFormat';
import { MajorManager } from './managers/MajorManager';
import { ModuleManager } from './managers/ModuleManager';

import { SubjectManager } from './managers/SubjectManager';
import { FileManager } from './managers/FileManager';
import { NotFoundException } from '@nestjs/common';

const pathRootDirectory_ = './../root'

const dowloadSomeFileUrl = 'http://localhost:4000/file-handling/files/';


@Injectable()
export class FileHandlingService {

    majorManager: MajorManager;
    moduleManager: ModuleManager;
    subjectManager:SubjectManager;
    fileManager: FileManager;


    constructor(){
        this.majorManager = new MajorManager()
        this.moduleManager = new ModuleManager()
        this.subjectManager = new SubjectManager()
        this.fileManager = new FileManager()
    }

    static get dowloadSomeFileUrl_() {
        return dowloadSomeFileUrl;
    }

    static get pathRootDirectory() {
        return pathRootDirectory_;
    } 

       // returs dir list in given path 
    static getDirList(path:string){
        const { readdirSync } = require('fs')

        try{
            
            const getDirectories = source =>
                readdirSync(source, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            
            
                
            let listDir = getDirectories(path)
            return listDir;
        
        }catch(err){
            if (err.code === "ENOENT"){
                console.log("Major not found")
            }
        }

        
    }


    static  async createNewDir(path: string) {

        let fs = require('fs');

        return await new Promise((resolve, reject) => {

            fs.mkdir(path, function (err) {
                if (err) {

                    reject(new NotFoundException("Is not able to create file"));


                } else {

                    resolve("New directory " + path + " successfully created.");
                }
            });
        })
    }
    


//////////////////////////////////MAJOR//////////////////////////////////////////////
    async deleteMajorDir(directory_name_delete : Major){
    
        this.majorManager.deleteMajorDir(directory_name_delete);
    }

    // composes root/MAJOR
    createPathMajor(major:Major){

        return this.majorManager.createPathMajor(major)
    }
    
    
    async getAllDirOfMajor(major:Major) {
        
        return this.majorManager.getAllDirOfMajor(major)
    }

        // creates directory on major level
    async createNewMajorDir(directory_name : String){
        
        return await this.majorManager.createNewMajorDir(directory_name) 
    }
/////////////////////////////////////////////////////////////////////////////////////////



/////////////////////MODULE//////////////////////////////////////////////////////////////


    async getAllDirOfModule(major: Major, module: string) {
        return this.moduleManager.getAllDirOfModule(major, module);
    }

    async createNewModuleDirInMajor(new_directory_name : string, major:Major){

        return await this.moduleManager.createNewModuleDirInMajor(new_directory_name, major)

    }
    async removeModuleDirInMajor(module_to_del:string, major:Major){
   
        return await this.moduleManager.removeModuleDirInMajor(module_to_del,major);
    }


    async renameModule(major: Major, currentModuleName:string, newModuleName:string){
        
        return await this.moduleManager.renameModule(major, currentModuleName, newModuleName)  
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////SUBJECTS///////////////////////////////


    async createNewSubject(major:Major,module: string,newNameSubject: string)
    {
       
        return await this.subjectManager.createNewSubject(major,module,newNameSubject)
        
    }



    async removeSubject(major:Major, module:string, subjectToDelete:string){
        
        return await this.subjectManager.removeSubject(major, module, subjectToDelete)
    }



    async getAllContentOfSubject(major: Major, module: string, subject: string) {
        return await this.getAllFilesOfPath(major,module, subject);   
    }


    async renameSubject(major:Major, module:string, subjectToRename:string, newNameForSubject:string){
        return await this.subjectManager.renameSubject(major, module, subjectToRename, newNameForSubject)
    }





    /////////////////////FILE MANAGER//////////////////////////////////////////


    async getAllFilesOfPath(major, module, subject){
        return await this.fileManager.getAllFilesOfPath(major, module,subject)
    }

    async getFileByName(file_name:String, res, major, module, subject){

        await this.fileManager.getFileByName(file_name, res, major, module, subject)
    }

    async uploadFile(file, major:Major, module_choosen: string, subject_choosen: string)
    {

            
        return await this.fileManager.uploadFile(file, major, module_choosen, subject_choosen)
        
    
    }






    

///////////////////////////////////////////////////////////////////////////////////////////////////////

}