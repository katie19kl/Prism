import { Injectable } from '@nestjs/common';
import { Major } from '../users/common/major.enum';
import { IndexingFormat } from './common/IndexingFormat';


const pathRootDirectory_ = './../root'

const someFileUrl_ = 'http://localhost:4000/file-handling/files/';


@Injectable()
export class FileHandlingService {

    static get linkSomeFileUrl() {
        return someFileUrl_;
    }

    static get pathRootDirectory() {
        return pathRootDirectory_;
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

    // deletes directory & its content on major level
    async deleteMajorDir(directory_name_delete : String){
    
        let fs = require('fs');
        let dirRoot = FileHandlingService.pathRootDirectory;
        let deleteMajorDir = dirRoot + '/' + directory_name_delete;

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


    async getAllFilesOfPath(path:string){
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
                                url: all_file_url_ + file,
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
		console.log(files_name)
		return files_name
    }


    async getFileByName(file_name:String, res, fullPath){

        const directory = fullPath;

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


    // composes root/MAJOR
    createPathMajor(major:Major){
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major
        return pathMajor;
    }

    createPathMajorModule(major: Major, module: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module;
        return pathMajor;
    }

    createPathMajorModuleSubject(major: Major, module: string, subject: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module + '/' + subject;
        return pathMajor;
    }


    // returs dir list in given path 
    getDirList(path:string){
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
    createPathMajorModel(module_index: string, pathMajor){
        
        
        let dirsInMajor = this.getDirList(pathMajor)
        console.log(dirsInMajor)
        console.log("==========")

        let nameOfIndexedDir = this.getNameOfIndexedDirModule(dirsInMajor,module_index);
        console.log(nameOfIndexedDir);


        let pathMajorModel = pathMajor + "/" + module_index + IndexingFormat.ModuleSeparator + nameOfIndexedDir;
        return pathMajorModel;

    }


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

        let subjectDirs = this.getDirList(pathMajorModule);
        let subjectDirName = this.getNameOfIndexedDirSubject(subjectDirs, insideModuleIndex)
        let pathMajorModelSubject = pathMajorModule + '/' +  module_index + IndexingFormat.SubjectSubIndexing + insideModuleIndex + IndexingFormat.SubjectSeparator + subjectDirName
        
        console.log(pathMajorModelSubject)
        return pathMajorModelSubject;
    }

    // creates path based of major/module/subject
    createFinalPath(major:Major, module_index: string,insideModuleIndex: string){
        
        let pathMajor = this.createPathMajor(major);
        let pathMajorModel = this.createPathMajorModel(module_index,pathMajor);
        let pathMajorModelSubject = this.createPathMajorModelSubject(insideModuleIndex, module_index ,pathMajorModel);
        
        return pathMajorModelSubject
    }


    async uploadFile(file, major:Major, module_index: string, 
        insideModuleIndex: string)
    {

            
            let file_name = file.originalname;
            let finalPath = this.createFinalPath(major, module_index, insideModuleIndex)
            
            let pathToStore = finalPath + "/" + file_name;
            console.log(pathToStore)
            this.storingFileToPath(file, pathToStore)



    } 

    async getAllDirOfMajor(major:Major) {
        let fullPath = this.createPathMajor(major);
        return this.getDirList(fullPath);
    }

    async getAllDirOfModule(major: Major, module: string) {
        let fullPath = this.createPathMajorModule(major, module);

        return this.getDirList(fullPath);
    }

    async getAllContentOfSubject(major: Major, module: string, subject: string) {
        let fullPath = this.createPathMajorModuleSubject(major, module, subject);

        return await this.getAllFilesOfPath(fullPath);
    }
}
