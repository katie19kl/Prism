import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/core/injector/module';
import { Major } from '../users/common/major.enum';
import { IndexingFormat } from './common/IndexingFormat';
import { MajorManager } from './managers/MajorManager';
import { ModuleManager } from './managers/ModuleManager';

const pathRootDirectory_ = './../root'

const someFileUrl_ = 'http://localhost:4000/file-handling/files/';


@Injectable()
export class FileHandlingService {

    majorManager: MajorManager;
    moduleManager: ModuleManager;

    constructor(){
        this.majorManager = new MajorManager()
        this.moduleManager = new ModuleManager()
    }

    static get linkSomeFileUrl() {
        return someFileUrl_;
    }

    static get pathRootDirectory() {
        return pathRootDirectory_;
    } 

       // returs dir list in given path 
    static getDirList(path:string){
        const { readdirSync } = require('fs')

        const getDirectories = source =>
            readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        
            
        console.log("---------")
        //console.log(getDirectories(path))
        let listDir = getDirectories(path)
        
        return listDir;
        
    }
    





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
/////////////////////////////////////////////////////////////////////////////////////////


    async getAllDirOfModule(major: Major, module: string) {
        return this.moduleManager.getAllDirOfModule(major, module);
    }

    async createNewModuleDirInMajor(new_directory_name : string, major:Major){

        await this.moduleManager.createNewModuleDirInMajor(new_directory_name, major)

    }
    async removeModuleDirInMajor(module_to_del:string, major:Major){

        await this.moduleManager.removeModuleDirInMajor(module_to_del,major);
    }






















    ////////////////////////////////////
/*
    async getIndexOfLastModule(major:Major){

        let fs = require('fs');
        let dirMajor = FileHandlingService.pathRootDirectory + "/" + major
       
        console.log(dirMajor)


        let dirs_in_major: any[] =  await new Promise ((resolve, reject) => {

            let dirs = []
            fs.readdir(dirMajor, async (err, files) => {
                                        
                if (err) {
                    reject(err);
                }
                for await(const file of files){
                    const stat = await fs.promises.stat( dirMajor + "/" + file);
                    if (await stat.isDirectory()) {
                        dirs.push[file];
                    }
                }
                resolve(files)
            });
        })
        console.log(dirs_in_major)
        console.log("!@!@!@!@!!@!@")

        let amount_modules = 0
        for (const foo of dirs_in_major){
            amount_modules = amount_modules + 1
        }
        console.log(amount_modules)
        return amount_modules
        
        

    }

    // creates directory in major level
    async createNewModuleDirInMajor(new_directory_name : string, major:Major){
        let lastIndex = await this.getIndexOfLastModule(major) + 1
        let pathMajor = this.createPathMajor(major)
        let pathModuleNew = this.createPathMajorModel(lastIndex.toString(),pathMajor, new_directory_name)
        console.log(pathModuleNew)
        await this.createNewMDir(pathModuleNew)

    }


    async createNewMDir(path:string){
     
        let fs = require('fs');

        return await new Promise ((resolve, reject) => {
    
            fs.mkdir(path, function(err) {
                if (err) {
                    console.log("here");
                    console.log(err);
                    reject(err);
                    

                } else {

                    console.log("New directory " +  path + " successfully created.");
                    resolve(path);
                }
            });
        })
    }

    async decreaseIndexesModulesAfterRemoved(removedIndex, major:Major){
        
        const fs = require("fs")
        //let path = FileHandlingService.pathRootDirectory + "/" + major
        let path = this.createPathMajor(major)
        let all_dirs = FileHandlingService.getDirList(path)
        console.log(all_dirs)

        
        for await(const dir of all_dirs){
            
            let index_dir = parseInt(dir[0])
            if (index_dir > removedIndex)
            {
                console.log(dir)
                
                let currentPath = path + "/" + dir;
                let index_new = parseInt(dir[0]) - 1
                let dirNew = dir.replace(dir[0], index_new.toString());
                let newPath = path + "/" + dirNew

                console.log(newPath);
                console.log(currentPath);
                console.log("=========");

                fs.rename(currentPath, newPath, function(err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Successfully renamed the directory.")
                    }
                })
            }
        }

        
                    
    }
    
 
    */


   






    async getAllFilesOfPath(major, module_, subject){
        let path =  this.createPathMajorModuleSubject(major,module_,subject);
        let pathToDowload = "/" + major + "/" + module_ + "/" + subject
        let all_file_url_ = FileHandlingService.linkSomeFileUrl;
		let files_name = [];
		const directory = path;
		const fs = require('fs');

        console.log("path")
        console.log(path);

        const get_f = async() => {

			await new Promise ((resolve, reject) => {

				fs.readdir(directory, async (err, files) => {
                    
                    
					if (err) {
						reject(err);
					}
                    for await(const file of files){
                        const stat = await fs.promises.stat( directory + "/" + file);
                        if (await stat.isFile()) {
                            console.log("=============");
                            console.log(file);
                            console.log("is file only");
                            files_name.push(
                                {
                                file_name: file,
                                url: all_file_url_ + file + pathToDowload,
                                }
                            )		
                        }
                        else {
                            files_name.push(
                                {
                                file_name: file,
                                //url: " ",
                                }
                            )	

                        }
                    }
					resolve(files)
				});
			})
		}

		await get_f()
        console.log("---->>>>>>>>")
		console.log(files_name)
        console.log("---->>>>>>>>")
		return files_name
    }


    async getFileByName(file_name:String, res, dirPath){

        const directory = dirPath + "/";

		let path = require('path');
		let mime = require('mime');
		
		let fs = require('fs');
		let file = directory+file_name

		let filename = path.basename(file);
		let mimetype = mime.lookup(file);

		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', mimetype);

		var filestream = fs.createReadStream(file);
		filestream.pipe(res);

    }
    
    storingFileToPath(file, pathToStore){
        console.log(pathToStore)
        let fs = require('fs');
        fs.open(pathToStore, 'wx', (err, desc) => {
            if(!err && desc) {
                
                fs.writeFile(desc, file.buffer, (err) => {
                        if (err) {
                            throw err;
                        }                
                        console.log('Results Received');
                })
            }
        })
    }

    

/*
    createPathMajorModule(major: Major, module: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module;
        return pathMajor;
    }*/

    createPathMajorModuleSubject(major: Major, module: string, subject: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module + '/' + subject;
        return pathMajor;
    }
    


 

/*
    // given list of all dirs in some module path
    // return name with given index
    getNameOfIndexedDirModule(dirsInMajor, module_index: String) {
        
        let index = '';
        let nameOfIndex = '';

        for (let dir of dirsInMajor){
            let tokenedDir = dir.split(IndexingFormat.ModuleSeparator)
            // parse dir index & name
            if (tokenedDir.length == 2){
                index = tokenedDir[0]
                nameOfIndex = tokenedDir[1]
            }
            // desired index was found
            if (index === module_index){
                return nameOfIndex;
            }


        }

        return " "
    }

    //composes root/major/model of given module index
    createPathMajorModel(module_index: string, pathMajor, new_module:string){
        
        
        let dirsInMajor = FileHandlingService.getDirList(pathMajor)
        console.log(dirsInMajor)
        console.log("==========")

        let nameOfIndexedDir = this.getNameOfIndexedDirModule(dirsInMajor,module_index);
        console.log(nameOfIndexedDir);


        let pathMajorModel = pathMajor + "/" + module_index + IndexingFormat.ModuleSeparator + new_module;
        return pathMajorModel;

    }

*/
    // given list of all dirs in some module
    // return name with given index
    getNameOfIndexedDirSubject(dirsInModule, subject_index: string){
        
        let index = ''
        let nameOfIndex = ''

        let indexSubject = ''

        for (let dir of dirsInModule){
            let tokenedDir = dir.split(IndexingFormat.SubjectSeparator)
            // parse dir index & name
            if (tokenedDir.length == 2){
                index = tokenedDir[0]

                nameOfIndex = tokenedDir[1]
            }
            // desired index was found
            let tokenedIndex = index.split(IndexingFormat.SubjectSubIndexing)
            if (tokenedIndex.length == 2){
                indexSubject = tokenedIndex[1];
            }
            if (indexSubject === subject_index){
                return nameOfIndex;
            }
        }

        return " "
    }


    // composes root/major/module/ subject if given subject index
    createPathMajorModelSubject(insideModuleIndex: string,module_index:string, pathMajorModule: string){

        let subjectDirs = FileHandlingService.getDirList(pathMajorModule);
        let subjectDirName = this.getNameOfIndexedDirSubject(subjectDirs, insideModuleIndex)
        let pathMajorModelSubject = pathMajorModule + '/' +  module_index + IndexingFormat.SubjectSubIndexing + insideModuleIndex + IndexingFormat.SubjectSeparator + subjectDirName
        
        console.log(pathMajorModelSubject)
        return pathMajorModelSubject;
    }

    // creates path based of major/module/subject
    createFinalPath(major:Major, module_index: string,insideModuleIndex: string){
        console.log("1")
        let pathMajor = this.createPathMajor(major);
        console.log("2")
        //let pathMajorModel = this.createPathMajorModel(module_index,pathMajor);
        console.log("3")
        //let pathMajorModelSubject = this.createPathMajorModelSubject(insideModuleIndex, module_index ,pathMajorModel);
        console.log("4")
        //return pathMajorModelSubject
    }


    async uploadFile(file, major:Major, module_index: string, 
        insideModuleIndex: string)
    {

            console.log("000")
            let file_name = file.originalname;
            let finalPath = this.createFinalPath(major, module_index, insideModuleIndex)
            
            let pathToStore = finalPath + "/" + file_name;
            console.log("1111")
            console.log(pathToStore)
            this.storingFileToPath(file, pathToStore)



    } 
 



    async getAllContentOfSubject(major: Major, module: string, subject: string) {
        //let fullPath = this.createPathMajorModuleSubject(major, module, subject);
        console.log("1=1=1=1=1=1=11=1=")
        console.log(subject)
        return await this.getAllFilesOfPath(major,module, subject);   
    }




}