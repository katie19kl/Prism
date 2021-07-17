import { ConflictException, Injectable } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { MajorManager } from './managers/MajorManager';
import { ModuleManager } from './managers/ModuleManager';
import { SubjectManager } from './managers/SubjectManager';
import { FileManager } from './managers/FileManager';
import { NotFoundException } from '@nestjs/common';
import { SubjectsOnDemandService } from '../subjects-on-demand/subjects-on-demand.service';
import { UsersService } from '../users/users.service';
import { Synchronizer } from '../synchronizer/Synchronizer';


const pathRootDirectory_ = './../root'
const dowloadSomeFileUrl = 'http://localhost:4000/file-handling/files/';


@Injectable()
// Its main functionality is - activate appropriate manager
export class FileHandlingService {

    majorManager: MajorManager;
    moduleManager: ModuleManager;
    subjectManager:SubjectManager;
    fileManager: FileManager;


    constructor() {
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
    static getDirList(path:string) {
        const { readdirSync } = require('fs')

        try {
            
            const getDirectories = source =>
                readdirSync(source, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
                
            let listDir = getDirectories(path)
            return listDir;
        
        } catch(err) {
            if (err.code === "ENOENT") {
         
                let empty = []
                return empty
            }
        }
    }


    static async createNewDir(path: string) {

        let fs = require('fs');

        return await new Promise((resolve, reject) => {
            
            if (path === "undefined") {
                reject(new ConflictException("This name already exist"));

            } else {
                
                fs.mkdir(path, function (err) {

                    if (err) {
                        reject(new NotFoundException("Is not able to create file"));
                    } else {
                        resolve("New directory " + path + " successfully created.");
                    }
                });
            }
        })
    }
    

    // activate appropriate manager
    async deleteMajorDir(directory_name_delete : Major) {    
        this.majorManager.deleteMajorDir(directory_name_delete);
    }

    // composes root/MAJOR
    createPathMajor(major:Major) {
        return this.majorManager.createPathMajor(major)
    }
    
    
    async getAllDirOfMajor(major:Major) {
        return this.majorManager.getAllDirOfMajor(major)
    }

    // creates directory on major level
    async createNewMajorDir(directory_name : String) {    
        return await this.majorManager.createNewMajorDir(directory_name) 
    }


    async getAllDirOfModule(major: Major, module: string) {
        return this.moduleManager.getAllDirOfModule(major, module);
    }

    async createNewModuleDirInMajor(new_directory_name : string, major:Major) {

        return await this.moduleManager.createNewModuleDirInMajor(new_directory_name, major)
    }

    async removeModuleDirInMajor(module_to_del:string, major:Major, synchronizer:Synchronizer) {
   
        return await this.moduleManager.removeModuleDirInMajor(module_to_del,major,synchronizer);
    }


    async renameModule(major: Major, currentModuleName:string, newModuleName:string,synchronizer:Synchronizer) {
        
        return await this.moduleManager.renameModule(major, currentModuleName, newModuleName,synchronizer)  
    }

    async createNewSubject(major:Major,module: string,newNameSubject: string, 
                            userService: UsersService,subjectOnDemandService:SubjectsOnDemandService) {
       
        return await this.subjectManager.createNewSubject(major,module,newNameSubject,userService,subjectOnDemandService)
        
    }

    async removeSubject(major:Major, module:string, subjectToDelete:string,synchronizer:Synchronizer) {       
        return await this.subjectManager.removeSubject(major, module, subjectToDelete,synchronizer)
    }


    async getAllContentOfSubject(major: Major, module: string, subject: string) {
        return await this.getAllFilesOfPath(major,module, subject);   
    }


    async renameSubject(major:Major, module:string, subjectToRename:string, newNameForSubject:string, synchronizer:Synchronizer) {
        return await this.subjectManager.renameSubject(major, module, subjectToRename, newNameForSubject, synchronizer)
    }

    async getAllFilesOfPath(major, module, subject) {
        return await this.fileManager.getAllFilesOfPath(major, module,subject)
    }

    async getFileByName(file_name:String, res, major, module, subject ){
        return await this.fileManager.getFileByName(file_name, res, major, module, subject)
    }

    async uploadFile(file, major:Major, module_choosen: string, subject_choosen: string) {
        return await this.fileManager.uploadFile(file, major, module_choosen, subject_choosen) 
    }


    async deleteFile(major:Major, module:string, subject:string, file_to_delete:string) {
        return await this.fileManager.deleteFile(major, module, subject, file_to_delete)
    }

}