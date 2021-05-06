import { ConflictException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { Major } from "src/server/users/common/major.enum";
import { FileHandlingService } from "../file-handling.service";



export class FileManager{



    createPathMajorModuleSubject(major: Major, module: string, subject: string) {
        let path = FileHandlingService.pathRootDirectory;
        let pathMajor = path + '/' + major + '/' + module + '/' + subject;
        return pathMajor;
    }



    //async getAllFilesOfPath(major, module_, subject){
        async getAllFilesOfPath(major, module_, subject){

        let path =  this.createPathMajorModuleSubject(major,module_,subject);
        let pathToDowload = "/" + major + "/" + module_ + "/" + subject
        let all_file_url_ = FileHandlingService.dowloadSomeFileUrl_;
		let files_name = [];
		const directory = path;
  


		const fs = require('fs');
        


        const get_f = async() => {
        	await new Promise ((resolve, reject) => {
        		fs.readdir(directory, async (err, files) => {
                    
        			if (err) {
        				reject(new NotFoundException("Provided directory doesnt exists"));
					}
                    else {
                        for await(const file of files){
                            console.log(file)

                            const stat = await fs.promises.stat( directory + "/" + file);
        
                            if (await stat.isFile()) {
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
                    }
				});
			})
		}

		await get_f()
        //console.log("---->>>>>>>>")
		//console.log(files_name)
        //console.log("---->>>>>>>>")
		return files_name
    }








    async uploadFile(file, major:Major, module_choosen: string, 
        subject_choosen: string)
    {

    
            
            let file_name = " "
            if (file === undefined){
                file_name = "undefined"
            }else {
                file_name = file.originalname;
            }
            
            
            let pathToStore = FileHandlingService.pathRootDirectory + "/" + major + "/" + module_choosen + "/" + subject_choosen
            pathToStore = pathToStore + "/" + file_name;
     
     

            return this.storingFileToPath(file, pathToStore)



    } 

        
    storingFileToPath(file, pathToStore){

        let fs = require('fs');
        return new Promise((resolve,reject)=>{

            fs.open(pathToStore, 'wx', (err, file_descriptor) => {
                if(!err && file_descriptor) {
                    fs.writeFile(file_descriptor, file.buffer, (err) => {
                            
                            ///////////////


                            fs.close(file_descriptor, (err) => {
                                if (err)
                                
                                  reject(new NotFoundException("Failed to close descriptor!"))
                                else {
                                    console.log("File descriptor was closed")
                                    resolve("File successfully added")
                                }
                              });
                            ///////////

                            if (err) {
                                reject(new NotFoundException("Not able to create file.Please check directory!"))
                            }

                            //resolve("File successfully added")
                    })
               }
                else {
                    reject(new ConflictException("Not able to create file. File already exist"))

                }
            })
        })
    }



    async getFileByName(file_name:String, res, major, module, subject){



        
        

        let dirPath = this.createPathMajorModuleSubject(major, module, subject)
        const directory = dirPath + "/";

		let path = require('path');
		let mime = require('mime');
		
		let fs = require('fs');
		let file = directory+file_name


     
        let fileExist = false
        
        try {
          if (fs.existsSync(file)) {
            fileExist = true;
          }
        } catch(err) {
            fileExist = false
        }


        if (fileExist){
            let filename = path.basename(file);
            let mimetype = mime.lookup(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
        }
        else{
            
            await new Promise((res,rej)=>{
                rej(new NotFoundException("Desired file does not exist"))
            })



            
        }
    }


    createFileFullPath(major:Major,module:string,subject:string ,fileName:string)
    {
        let path = this.createPathMajorModuleSubject(major,module,subject) + "/" +fileName
        return path;
    }


    async  deleteFile(major:Major, module:string, subject:string, file_to_delete:string){
        //console.log("Deleting file " + file_to_delete)

        let file_path = this.createFileFullPath(major,module,subject,file_to_delete)
        
        
        const fs = require('fs').promises;
        //const fs = require('fs')

        let isDeleted = await (async () => {
        try {
            await fs.unlink(file_path);
            //fs.unlinkSync(file_path);
            
            return 1
        } catch (e) {
            return 0
        }
        })();

        if (isDeleted){
            console.log("file " , file_to_delete , " was deleted ")
            return "Deleted Successfully"
        }else{
            await new Promise((res,rej)=>{
                rej(new NotFoundException("Provided file does not  exist"))
            })
            
        }
    }



}